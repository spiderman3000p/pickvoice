import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { DataStorage } from '../../services/data-provider';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, catchError, retry } from 'rxjs/operators';
import { LocationsService, ItemsService, Item, ItemType, OrderService, Customer, OrderLine, OrderDto,
         Order, Transport, Location, UnityOfMeasure, Section } from '@pickvoice/pickvoice-api';
import { HttpResponse } from '@angular/common/http';

export interface ValidationError {
  error: string;
  index: number;
}
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  headers: any; // contendra las cabeceras de las columnas a mostrar en la tabla
  validationRequested = false;
  invalidRows: any[] = [];
  dataSource: MatTableDataSource<any>;
  dataToSend: any[];
  displayedColumns = []; // contendra las columnas de la entidad a impotar: items, locations u orders
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  isDataSaved = false;
  isReadyToSend = false;
  errorOnSave = false;
  dataValidationErrors: ValidationError[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.initPaginatorSort();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.initPaginatorSort();
  }

  constructor(
    private dialog: MatDialog, private itemsService: ItemsService, private ordersService: OrderService,
    private locationsService: LocationsService, private utilities: UtilitiesService,
    private dataProvider: DataStorage, private recentOriginsService: RecentOriginsService,
    private cdr: ChangeDetectorRef ) {

    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
    this.dataValidationErrors = [];
    this.dataToSend = [];
    // this.initPaginatorSort();
  }

  importWidget() {
    const dialogRef = this.dialog.open(ImportingWidgetComponent,
      {
        width: '90vw',
        height: '90vh'
      });
    dialogRef.afterClosed().subscribe(jsonResult => {
      this.isLoadingResults = false;
      this.utilities.log('dialog result:', jsonResult);
      const selectedType = this.dataProvider.getDataType();

      if (jsonResult && jsonResult.length > 0) {
        const receivedKeys: any[] = Object.keys(jsonResult[0]);
        const headers = this.utilities.dataTypesModelMaps[selectedType];
        const displayedColumns = Object.keys(headers);
        this.utilities.log('displayedColumns in import component', displayedColumns);

        if (!this.utilities.equalArrays(receivedKeys, displayedColumns)) {
          this.utilities.log('received keys', receivedKeys);
          this.utilities.log('required keys', displayedColumns);
          this.utilities.error('the received data schema is invalid');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
        // agregamos el campo indice a todos los elementos del resultado
        jsonResult = jsonResult.map((element, i) => new Object({index: i, ...element}));
        if (this.dataSource === undefined) {
          this.dataSource = new MatTableDataSource<any>(jsonResult);
        } else {
          this.dataSource.data = []; // importante limpiar la data primero
          this.displayedColumns = displayedColumns; // importante establecer las nuevas columnas a mostrar
          this.headers = headers; // importante establecer las nuevas cabeceras
          this.dataSource.data = this.mapTableData(jsonResult); // formar objetos a partir del json
        }
        this.sendData();
      }
    });
  }

  renderColumnData(type: string, data: any) {
    return this.utilities.renderColumnData(type, data);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendData() {
    this.utilities.log('start sending data proccess...');
    this.validateData();
    if (this.dataValidationErrors.length === 0 && this.isReadyToSend) {
      this.utilities.log('sending data to api...');
      this.isLoadingResults = true;
      const selectedType = this.dataProvider.getDataType();
      if (selectedType === IMPORTING_TYPES.ITEMS) {
        this.sendItemsData();
      } else if (selectedType === IMPORTING_TYPES.LOCATIONS) {
        this.sendLocationsData();
      } else if (selectedType === IMPORTING_TYPES.ORDERS) {
        this.sendOrdersData();
      }
    } else {
      this.utilities.error('Data are not ready to be sent');
      this.utilities.showSnackBar('Data are not ready to be sent', 'OK');
    }
  }

  sendItemsData() {
    this.itemsService.createItemsList(this.dataToSend, 'response', true).pipe(retry(3))
    .subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      this.handleApiCallResult(result, IMPORTING_TYPES.ITEMS);
    }, error => {
      this.utilities.error('Error en request', error);
      this.utilities.showSnackBar('Error saving items', 'OK');
      this.isLoadingResults = false;
    });
  }

  sendLocationsData() {
    this.locationsService.createLocationsList(this.dataToSend, 'response', true).pipe(
      retry(3)
    ).subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      this.handleApiCallResult(result, IMPORTING_TYPES.LOCATIONS);
    }, error => {
      this.utilities.error('Error en request', error);
      this.utilities.showSnackBar('Error saving locations', 'OK');
      this.isLoadingResults = false;
    });
  }

  sendOrdersData() {
    this.ordersService.createOrderList(this.dataToSend, 'response', true).pipe(retry(3))
    .subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      this.handleApiCallResult(result, IMPORTING_TYPES.ORDERS);
    }, error => {
      this.utilities.error('Error en request');
      this.utilities.showSnackBar('Error saving orders', 'OK');
      this.isLoadingResults = false;
    });
  }

  handleApiCallResult(result: any, type: string) {
    let snackMessage = '';
    let importedRows = 0;
    let rejectedRows = 0;
    // result as HttpResponse is expected
    this.utilities.log('api call result', result);

    if (result && result.status === 201 && result.ok) {
      rejectedRows = result.body.rowErrors === null ? 0 : result.body.rowErrors.length;
      importedRows = this.dataToSend.length - rejectedRows;
      if (importedRows > 0) {
        const newOrigin = new RecentOrigin();
        newOrigin.filename = this.dataProvider.getFileName();
        newOrigin.filepath = this.dataProvider.filePath;
        newOrigin.totalRows = this.dataToSend.length; // numero de registros
        newOrigin.importedRows = importedRows; // numero de registros aceptados en la bd api
        newOrigin.rejectedRows = rejectedRows; // numero de registros no aceptados en la bd api
        this.addRecentOrigin(newOrigin, type);
      }
      if ((result.body.code === 200 || result.body.code === 201) &&
           result.body.rowErrors === null && result.body.status === 'OK') {

        this.isDataSaved = true;
        snackMessage = `data imported successfully`;
        this.utilities.log(snackMessage);

      } else if (result.body.code === 500 && result.body.rowErrors !== null &&
        result.body.status === 'INTERNAL_SERVER_ERROR') {

        this.isDataSaved = false;
        this.invalidRows = result.body.rowErrors;
        this.dataValidationErrors = result.body.rowErrors;
        snackMessage = result.body.message ? result.body.message : `Error saving data`;
        this.utilities.error(snackMessage);
        this.showErrorsOnTable(result.body.rowErrors);
      } else {
        this.errorOnSave = true;
      }
      /*
        Dejamos en la tabla solo los registros invalidos, si no hay registros invalidos la tabla
        quedara vacia y no se mostrara en pantalla.
      */
      this.dataSource.data = this.dataSource.data.filter(row => row.invalid);
    }
    this.utilities.showSnackBar(snackMessage, 'OK');
  }

  showErrorsOnTable(errors: any[]) {
    let dataRow: any;
    errors.forEach(error => {
      dataRow = this.dataSource.data.find(row => row.sku == error.element.sku);
      dataRow.invalid = true;
      dataRow.tooltip = '';
      for (const errorType in error.errors) {
        if (1) {
          dataRow.tooltip += error.errors[errorType] + ',';
        }
      }
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  validateData() {
    this.utilities.log(`starting data validation for ${this.dataProvider.getDataType()}`);
    if (this.dataSource.data.length > 0) {
      this.dataToSend = [];
      this.dataValidationErrors = [];
      this.invalidRows = [];
      let currentRowErrors = [];
      let errorFound: boolean;
      this.isLoadingResults = true;
      let exists;
      const copyData = this.dataSource.data.slice();
      let rowToSave: any;
      const selectedType = this.dataProvider.getDataType();
      copyData.forEach((row, rowIndex) => {
        if (selectedType === IMPORTING_TYPES.ITEMS) {
          rowToSave = Object.assign(row) as Item;
        }
        if (selectedType === IMPORTING_TYPES.LOCATIONS) {
          rowToSave = Object.assign(row) as Location;
        }
        if (selectedType === IMPORTING_TYPES.ORDERS) {
          rowToSave = Object.assign(row) as Order;
        }
        errorFound = false;
        currentRowErrors = [];
        for (const field in this.headers) {
          if (1) {// just for avoid lint error mark on visual studio code
            // comprobando campos requeridos
            if (this.headers[field].required && row[field] === undefined) {
              // this.utilities.log('it is required?');
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `The field ${this.headers[field].name} (${field}) is required`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              this.utilities.error(`There's no exists the field ${field} in the record ${rowIndex}`);
            }
            if (this.headers[field].min && row[field] < this.headers[field].min) {
              // this.utilities.log('it is lower than min?');
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `The field ${this.headers[field].name} (${field})
                must be greater than ${this.headers[field].min}`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              this.utilities.error(`The field ${this.headers[field].name} (${field})
              must be greater than ${this.headers[field].min} in the record ${rowIndex}`);
            }
            if (this.headers[field].max && row[field] > this.headers[field].max) {
              // this.utilities.log('it is greater than max?');
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `The field ${this.headers[field].name} (${field})
                must be lower than ${this.headers[field].max}`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              this.utilities.error(`The field ${this.headers[field].name} (${field})
              must be lower than ${this.headers[field].max} in the record ${rowIndex}`);
            }
            // comprobando si el campo es unico
            exists = 0;
            // usamos un forEach en lugar de findIndex o find, para contar el numero de apariciones
            copyData.forEach((element, index) => {
              if (index !== rowIndex) {
                /*
                usamos == en la comparacion en lugar de === ya que podria haber problemas con los
                tipos de datos y el json
                */
                exists += element[field] == row[field] ? 1 : 0;
              }
            });
            if (this.headers[field].unique && row[field] !== ''  && exists > 0) {
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `The field ${this.headers[field].name} (${field})
                must be unique in all the collection. It repits ${exists} times`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              this.utilities.error(`The field ${this.headers[field].name} (${field})
              must be unique in all the collection, in the record ${rowIndex}. It repits ${exists} times`);
            }
          }
        }
        /*
          agregamos un campo indice para poder usarlo en el mat-table.
          TODO: debe haber alguna forma de obtener el indice en el mat-table, sin necesidad de hacer esto
          pero por los momentos es una solucion
        */
        this.dataSource.data[rowIndex].index = rowIndex;
        // omitimos el registro si hay algun error de validacion en él
        if (errorFound) {
          this.invalidRows.push({ row: rowIndex, errors: currentRowErrors.slice() });
          this.dataSource.data[rowIndex].invalid = true;
          this.dataSource.data[rowIndex].tooltip = currentRowErrors.slice().map((_row, _index) => {
            return _row.error + ((_index < (currentRowErrors.length - 1)) ? ',' : '');
          }).toString();
          this.utilities.error(`invalid row ${rowIndex}`, this.dataSource.data[rowIndex]);
          return;
        } else {
          this.dataSource.data[rowIndex].tooltip = null;
          this.dataSource.data[rowIndex].invalid = false;
          this.utilities.log(`valid row ${rowIndex}`, this.dataSource.data[rowIndex]);
        }
        // lo añadimos a la lista de datos a enviar, en caso de que cumpla con todas las validaciones
        this.dataToSend.push(rowToSave);
      });

      this.validationRequested = true;
      this.isLoadingResults = false;
      this.isReadyToSend = this.dataValidationErrors.length === 0;
      this.utilities.log('data to send', this.dataToSend);
      this.utilities.log('ready to send? ', this.isReadyToSend);
      this.utilities.log('validation errors', this.dataValidationErrors);
      this.utilities.log('validation errors per row', this.invalidRows);
      if (this.dataValidationErrors.length > 0) {
        this.utilities.showSnackBar(`There are ${this.invalidRows.length} invalid records`, 'OK');
      }
    } else {
      this.utilities.log('There is not data in the table');
      this.utilities.showSnackBar(`There is no data to import`, 'OK');
    }
  }

  mapTableRow(row: any): any {
    const selectedType = this.dataProvider.getDataType();
    for (const field in this.headers) {
      if (1) {// just for avoid lint error mark on visual studio code
        // arreglamos los valores booleanos en caso de que esten en formato texto mayusculas
        if (row[field] === 'TRUE' || row[field] === 'FALSE') {
          row[field] = row[field] === 'TRUE' ? true : false;
        }
        /*
          Comprobacion de datos compuestos (usando varias columnas), dependiendo del tipo de importacion
          seleccionado
          TODO: eliminar estas comprobaciones al usar dto's
        */
        if (selectedType === IMPORTING_TYPES.ITEMS) {
          // this.utilities.log('validating compound items data');
          if (field === 'itemType') {
            const aux = row.itemType;
            row.itemType = new Object() as ItemType;
            row.itemType.code = aux;
            row.itemType.name = '';
            row.itemType.description = '';
          }
          if (field === 'uom') {
            const aux = row.uom;
            row.uom = new Object() as UnityOfMeasure;
            row.uom.code = aux;
            row.uom.description = '';
          }
          // añadimos campos por defecto
          row.itemState = Item.ItemStateEnum.Active;
        } else if (selectedType === IMPORTING_TYPES.LOCATIONS) {
          // this.utilities.log('validating compound locations data');
          if (field === 'section') {
            const aux = row.section;
            row.section = new Object() as Section;
            row.section.code = aux;
            row.section.description = '';
            row.section.name = '';
          }
        } else if (selectedType === IMPORTING_TYPES.ORDERS) {
          // this.utilities.log('validating compound orders data');
          // no hay datos compuestos en orders dto
        }
      }
    }
    return row;
  }

  mapTableData(data: any[]): any[] {
    this.utilities.log(`starting data mapping for ${this.dataProvider.getDataType()}`);
    data.forEach((row, rowIndex) => {
      row = this.mapTableRow(row);
    });
    return data;
  }

  editRow(rowToEdit: any) {
    const selectedType = this.dataProvider.getDataType();
    this.utilities.log('row to send to edit dialog', rowToEdit);
    this.utilities.log('map to send to edit dialog',
    this.utilities.dataTypesModelMaps[selectedType]);
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        width: '100vw',
        height: '100vh',
        data: {
          row: rowToEdit,
          map: this.utilities.dataTypesModelMaps[selectedType],
          type: selectedType,
          remoteSync: false // para mandar los datos a la BD por la API
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        result = this.mapTableRow(result);
        rowToEdit = result;
        this.refreshTable();
        /*Object.keys(result).forEach(key => {
          this.dataSource.data[index][key] = result[key];
        });*/
        /* Si se hace de esta forma no se muestran los cambios en la tabla mat-table
        let row = this.dataSource.data[index];
        row = result;*/
      }
    });
  }

  /*
    Esta funcion se encarga de refrescar la tabla cuando el contenido cambia.
    TODO: mejorar esta funcion usando this.dataSource y no el filtro
  */
  private refreshTable() {
    // If there's no data in filter we do update using pagination, next page or previous page
    if (this.dataSource.filter === '') {
      const aux = this.dataSource.filter;
      this.dataSource.filter = 'XXX';
      this.dataSource.filter = aux;
      // If there's something in filter, we reset it to 0 and then put back old value
    } else {
      const aux = this.dataSource.filter;
      this.dataSource.filter = '';
      this.dataSource.filter = aux;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initPaginatorSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getValidationAlertMessage() {
    let message = '';
    if (this.dataValidationErrors.length > 0) {
      message = `There are ${this.invalidRows.length} invalid records. Please, fix them and try again`;
    } else if (this.dataValidationErrors.length === 0 && !this.isDataSaved && !this.errorOnSave) {
      message = 'Data validated successfully. Press next to continue';
    } else if (this.errorOnSave) {
      message = 'Error on saving data';
    } else if (this.dataValidationErrors.length === 0 && this.isDataSaved) {
      message = 'Data saved successfully';
    }
    return message;
  }

  getValidateBtnText() {
    if (this.dataSource.data.length > 0 && !this.isReadyToSend) {
      if (!this.isLoadingResults) {
        if (!this.validationRequested) {
          return 'Validate';
        } else {
          return 'Validate Again';
        }
      } else {
        return 'Validating...';
      }
    }
    if (this.dataSource.data.length > 0 && this.isReadyToSend && !this.isLoadingResults) {
      return 'Next';
    }
  }

  addRecentOrigin(newOrigin: RecentOrigin, type: string) {
    this.recentOriginsService.addRecentOrigin(type, newOrigin);
  }

  ngOnInit() {
    this.initPaginatorSort();
  }

}
