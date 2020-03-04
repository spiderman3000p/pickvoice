import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { DataStorage } from '../../services/data-provider';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, catchError, retry } from 'rxjs/operators';
import { LocationsService, ItemsService, Item, ItemType, OrderService, Customer, OrderLine,
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
  dataValidationErrors: ValidationError[];
  skipedColumns = ['sku', 'description', 'itemType', 'codeUom', 'qtyRequired',
  'expiryDate', 'serial', 'codeLocation', 'baseItemOverride', 'caseLabelCheckDigits',
  'cartonCode', 'workCode']; // solo para orders
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults = false;
      this.utilities.log('dialog result:', result);
      if (result && result.length > 0) {

        const receivedKeys: any[] = Object.keys(result[0]);
        const displayedColumns = Object.keys(
          this.utilities.dataTypesModelMaps[this.dataProvider.getDataType()]
        );
        this.utilities.log('displayedColumns in import component', displayedColumns);
        const headers = this.utilities.dataTypesModelMaps[this.dataProvider.getDataType()];

        if (!this.utilities.equalArrays(receivedKeys, displayedColumns)) {
          this.utilities.log('received keys', receivedKeys);
          this.utilities.log('required keys', displayedColumns);
          this.utilities.error('the received data schema is invalid');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
        const newData = result.map((element, index) => {
          element.index = index;
          /*if (this.dataProvider.getDataType() === 'items') {
            this.utilities.lo
            aux = element.itemType.code;
            element.itemType = aux;
            aux = element.uom.code;
            element.uom = aux;
          }*/
          return element;
        });
        if (this.dataSource === undefined) {
          this.dataSource = new MatTableDataSource(newData);
        } else {
          this.dataSource.data = []; // importante limpiar la data primero
          this.displayedColumns = displayedColumns; // importante establecer las nuevas columnas
          this.headers = headers; // importante establecer las nuevas cabeceras
          this.dataSource.data = this.mapTableData(newData);
        }
        // setTimeout(() => this.initPaginatorSort(), 500);
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
      if (this.dataProvider.getDataType() === 'items') {
        this.sendItemsData();
      } else if (this.dataProvider.getDataType() === 'locations') {
        this.sendLocationsData();
      } else if (this.dataProvider.getDataType() === 'orders') {
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
      this.handleApiCallResult(result, 'items');
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
      this.handleApiCallResult(result, 'locations');
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
      this.handleApiCallResult(result, 'orders');
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
      if (result.body.code === 200 && result.body.rowErrors === null && result.body.status === 'OK') {
        this.isDataSaved = true;
        snackMessage = `${type} created successfully`;
        this.utilities.log(snackMessage);
      }
      if (result.body.code === 500 && result.body.rowErrors !== null && result.body.status === 'INTERNAL_SERVER_ERROR') {
        this.isDataSaved = false;
        this.invalidRows = result.body.rowErrors;
        this.dataValidationErrors = result.body.rowErrors;
        snackMessage = result.body.message ? result.body.message : `Error saving ${type}`;
        this.utilities.error(snackMessage);
        this.showErrorsOnTable(result.body.rowErrors);
      }
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

      copyData.forEach((row, rowIndex) => {
        if (this.dataProvider.getDataType() === 'items') {
          rowToSave = Object.assign(row) as Item;
        }
        if (this.dataProvider.getDataType() === 'locations') {
          rowToSave = Object.assign(row) as Location;
        }
        if (this.dataProvider.getDataType() === 'orders') {
          rowToSave = Object.assign(row) as Order;
        }
        errorFound = false;
        currentRowErrors = [];
        for (const field in this.headers) {
          if (1) {// just for avoid lint error mark on visual studio code
            /*
              Para el caso de la importacion de ordenes, hay ciertas columnas que no se van a validar
              en esta iteracion.
              Esas columnas a no iterar son las que se encuentran en el array skipedColumns.
              Esas columnas que se encuentren dentro del array skipedColumns son referenciadas directamente
              al momento de usarlas y no es necesario llegar a ellas por iteracion.
            */
            if (this.dataProvider.getDataType() === 'orders' && this.skipedColumns.findIndex(column => column === field) > -1) {
              continue;
            }
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
            // comprobando si el campo es unico
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
    for (const field in this.headers) {
      if (1) {// just for avoid lint error mark on visual studio code
        /*
          Para el caso de la importacion de ordenes, hay ciertas columnas que no se van a validar
          en esta iteracion.
          Esas columnas a no iterar son las que se encuentran en el array skipedColumns.
          Esas columnas que se encuentren dentro del array skipedColumns son referenciadas directamente
          al momento de usarlas y no es necesario llegar a ellas por iteracion.
        */
        if (this.dataProvider.getDataType() === 'orders' &&
          this.skipedColumns.findIndex(column => column === field) > -1) {
          continue;
        }
        // arreglamos los valores booleanos en caso de que esten en formato texto mayusculas
        if (row[field] === 'TRUE' || row[field] === 'FALSE') {
          row[field] = row[field] === 'TRUE' ? true : false;
        }
        /*
          Comprobacion de datos compuestos (usando varias columnas), dependiendo del tipo de importacion
          seleccionado
        */
        if (this.dataProvider.getDataType() === 'items') {
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
        } else if (this.dataProvider.getDataType() === 'locations') {
          // this.utilities.log('validating compound locations data');
          if (field === 'section') {
            const aux = row.section;
            row.section = new Object() as Section;
            row.section.code = aux;
            row.section.description = '';
            row.section.name = '';
          }
        } else if (this.dataProvider.getDataType() === 'orders') {
          // this.utilities.log('validating compound orders data');
          if (field === 'transport') {
            const aux = row.transport;
            row.transport = new Object() as Transport;
            row.transport.transportNumber = aux;
            row.transport.route = row.route ? row.route : '';
            row.transport.name = row.routeName ? row.routeName : '';
            row.transport.dispatchPlatforms = row.dispatchPlatforms ? row.dispatchPlatforms : '';
            row.transport.carrierCode = row.carrierCode ? row.carrierCode : '';
          }
          if (field === 'customerNumber') {
            const aux = row.customerNumber;
            row.customer = new Object() as Customer;
            row.customer.code = row.customerNumber;
            row.customer.name = row.customerName ? row.customerName : '';
            row.customer.address = row.address ? row.address : '';
          }
          if (field === 'sku') {
            const orderLine = new Object() as OrderLine;
            orderLine.item = new Object() as Item;
            orderLine.item.sku = row.sku;
            orderLine.item.description = row.description ? row.description : '';
            orderLine.item.itemType = row.itemType ? row.itemType : '';
            orderLine.item.uom = row.codeUom ? row.codeUom : '';

            orderLine.qtyRequired = row.qtyRequired ? row.Required : '';
            orderLine.expiryDate = row.expiryDate ? row.expiryDate : '';
            orderLine.serial = row.serial ? row.serial : '';

            orderLine.baseItemOverride = row.baseItemOverride ? row.baseItemOverride : '';
            orderLine.caseLabelCheckDigits = row.caseLabelCheckDigits ? row.caseLabelCheckDigits : '';

            row.orderLine = orderLine;
          }
          if (field === 'departureDateTime' || field === 'departureDateTime') {
            row[field] = new Date(row[field]);
          }
          if (field === 'location') {
            row.location = new Object() as Location;
            row.location.code = row.codeLocation ? row.codeLocation : '';
          }
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

  editRow(index: number) {
    this.utilities.log('row to send to edit dialog', this.dataSource.data[index]);
    this.utilities.log('map to send to edit dialog',
    this.utilities.dataTypesModelMaps[this.dataProvider.getDataType()]);
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        data: {
          row: this.dataSource.data[index],
          map: this.utilities.dataTypesModelMaps[this.dataProvider.getDataType()],
          type: this.dataProvider.getDataType(),
          remoteSync: false // para mandar los datos a la BD por la API
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        result = this.mapTableRow(result);
        Object.keys(result).forEach(key => {
          this.dataSource.data[index][key] = result[key];
        });
        /* Si se hace de esta forma no se muestran los cambios en la tabla mat-table
        let row = this.dataSource.data[index];
        row = result;*/
      }
    });
  }

  initPaginatorSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getValidationAlertMessage() {
    let message = '';
    if (this.dataValidationErrors.length > 0) {
      message = `There are ${this.invalidRows.length} invalid records. Please, fix them and try again`;
    }
    if (this.dataValidationErrors.length === 0 && !this.isDataSaved) {
      message = 'Data validated successfully. Press next to continue';
    }
    if (this.dataValidationErrors.length === 0 && this.isDataSaved) {
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
