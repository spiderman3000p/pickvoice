import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { DataStorage } from '../../services/data-provider';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, catchError, retry } from 'rxjs/operators';
import { LocationsService, ItemsService, Item, ItemType, OrderService, Customer, OrderLine,
         Order, Transport, Location, UnityOfMeasure } from '@pickvoice/pickvoice-api';
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
  // headers: any = ModelMap.ItemMap;
  headers: any; // contendra las cabeceras de las columnas a mostrar en la tabla
  validationRequested = false;
  invalidRows: any[] = [];
  dataSource: MatTableDataSource<any>;
  dataToSend: any[];
  // displayedColumns = Object.keys(ModelMap.ItemMap);
  displayedColumns = []; // contendra las columnas de la entidad a impotar: items, locations u orders
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  isDataSaved = false;
  isReadyToSend = false;
  dataValidationErrors: ValidationError[];
  skipedColumns = ['sku', 'description', 'itemType', 'codeUom', 'qtyToPicked',
  'expiryDate', 'serial', 'codeLocation', 'baseItemOverride', 'caseLabelCheckDigits',
  'cartonCode', 'workCode'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialog: MatDialog, private itemsService: ItemsService, private ordersService: OrderService,
    private locationsService: LocationsService, private utilities: UtilitiesService,
    private dataProvider: DataStorage ) {
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
    this.dataValidationErrors = [];
    this.dataToSend = [];
    this.dataProvider.dataType.subscribe(dataType => {
      this.displayedColumns = Object.keys(this.utilities.dataTypesModelMaps[dataType]);
      console.log('displayedColumns in import component', this.displayedColumns);
      this.headers = this.utilities.dataTypesModelMaps[dataType];
      console.log('headers in import component', this.headers);
    });
  }

  importWidget() {
    const dialogRef = this.dialog.open(ImportingWidgetComponent,
      {
        width: '90vw',
        height: '90vh'
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults = false;
      console.log('dialog result:', result);
      if (result && result.length > 0) {

        const receivedKeys: any[] = Object.keys(result[0]);

        if (!this.utilities.equalArrays(receivedKeys, this.displayedColumns)) {
          console.log('received keys', receivedKeys);
          console.log('required keys', this.displayedColumns);
          console.error('el formato de los datos recibidos no coincide con el formato esperado');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
        this.dataSource.data = result.map((element, index) => {
          element.index = index;
          return element;
        });
        this.sendData();
      }
    });
  }

  importFile(_type: string) {
    this.isDataSaved = false;
    this.isLoadingResults = true;
    const dialogRef = this.dialog.open(ImportDialogComponent,
      {
        data: {
          type: _type
        },
        width: '350px',
        height: '250px'
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults = false;
      if (result && result.length > 0) {
        const receivedKeys: any[] = Object.keys(result[0]);

        if (!this.utilities.equalArrays(receivedKeys, this.displayedColumns)) {
          console.log('received keys', receivedKeys);
          console.log('required keys', this.displayedColumns);
          console.error('el formato de los datos recibidos no coincide con el formato esperado');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
        this.dataSource.data = result.map((element, index) => {
          element.index = index;
          return element;
        });
        console.log('data final', this.dataSource.data);
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

  sendItemsData() {
    this.itemsService.createItemsList(this.dataToSend, 'response', true).pipe(
      retry(3)
    ).subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      // result as HttpResponse is expected
      console.log('api call result', result);
      // status 201 is successfull response (CREATED)
      if (result && result.status === 201 && result.ok) {
        this.isDataSaved = true;
        console.log('items created successfully');
        this.utilities.showSnackBar('Items saved successfully', 'OK');
       } else {
        this.isDataSaved = false;
        console.log('items could not be created');
        this.utilities.showSnackBar('Error saving items', 'OK');
      }
    });
  }

  sendLocationsData() {
    this.locationsService.createLocationsList(this.dataToSend, 'response', true).pipe(
      retry(3)
    ).subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      // result as HttpResponse is expected
      console.log('api call result', result);
      // status 201 is successfull response (CREATED)
      if (result && result.status === 201 && result.ok) {
        this.isDataSaved = true;
        console.log('locations created successfully');
        this.utilities.showSnackBar('Locations saved successfully', 'OK');
       } else {
        this.isDataSaved = false;
        console.log('locations could not be created');
        this.utilities.showSnackBar('Error saving locations', 'OK');
      }
    });
  }

  sendOrdersData() {
    this.ordersService.createOrderList(this.dataToSend, 'response', true).pipe(
      retry(3)
    ).subscribe(result => {
      this.isLoadingResults = false;
      result = result as HttpResponse<any>;
      // result as HttpResponse is expected
      console.log('api call result', result);
      // status 201 is successfull response (CREATED)
      if (result && result.status === 201 && result.ok) {
        this.isDataSaved = true;
        console.log('orders created successfully');
        this.utilities.showSnackBar('Orders saved successfully', 'OK');
       } else {
        this.isDataSaved = false;
        console.log('orders could not be created');
        this.utilities.showSnackBar('Error saving orders', 'OK');
      }
    });
  }

  sendData() {
    console.log('start sending data proccess...');
    this.validateData();
    if (this.dataValidationErrors.length === 0 && this.isReadyToSend) {
      console.log('sending data to api...');
      this.isLoadingResults = true;
      if (this.dataProvider.getDataType() === 'items') {
        this.sendItemsData();
      } else if (this.dataProvider.getDataType() === 'locations') {
        this.sendLocationsData();
      } else if (this.dataProvider.getDataType() === 'orders') {
        this.sendOrdersData();
      }
    } else {
      console.error('Data are not ready to be sent');
      this.utilities.showSnackBar('Data are not ready to be sent', 'OK');
    }
  }

  handleError(error: any) {
    console.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  validateData() {
    console.log(`starting data validation for ${this.dataProvider.getDataType()}`);
    if (this.dataSource.data.length > 0) {
      this.dataToSend = [];
      this.dataValidationErrors = [];
      this.invalidRows = [];
      let currentRowErrors = [];
      let errorFound: boolean;
      this.isLoadingResults = true;
      let exists;
      const copyData = this.dataSource.data.slice();

      copyData.forEach((row, rowIndex) => {
        const rowToSave = JSON.parse(JSON.stringify(row));
        errorFound = false;
        currentRowErrors = [];
        // console.log('headers before validate', this.headers);
        for (const field in this.headers) {
          if (1) {// just for avoid lint error mark on visual studio code
            // console.log('validating field ', field);
          /*
            Para el caso de la importacion de ordenes, hay ciertas columnas que no se van validar en esta iteracion.
            Esas columnas a no iterar son las que se encuentran en el array skipedColumns.
            Esas columnas que se encuentren dentro del array skipedColumns son referenciadas directamente.
          */
          if (this.dataProvider.getDataType() === 'orders' && this.skipedColumns.findIndex(column => column === field) > -1) {
            // console.log('skipped field ', field);
            continue;
          }
          // comprobando campos requeridos
          if (this.headers[field].required && (!row[field] || row[field].length === 0)) {
            // console.log('it is required?');
            const validationError = new Object() as ValidationError;
            validationError.index = rowIndex;
            validationError.error = `The field ${this.headers[field].name} (${field}) is required`;
            this.dataValidationErrors.push(validationError);
            currentRowErrors.push(validationError);
            errorFound = true;
            console.error(`There's no exists the field ${field} in the record ${rowIndex}`);
          }
          if (this.headers[field].min && row[field] < this.headers[field].min) {
            // console.log('it is lower than min?');
            const validationError = new Object() as ValidationError;
            validationError.index = rowIndex;
            validationError.error = `The field ${this.headers[field].name} (${field})
              must be greater than ${this.headers[field].min}`;
            this.dataValidationErrors.push(validationError);
            currentRowErrors.push(validationError);
            errorFound = true;
            console.error(`The field ${this.headers[field].name} (${field})
            must be greater than ${this.headers[field].min} in the record ${rowIndex}`);
          }
          if (this.headers[field].max && row[field] > this.headers[field].max) {
            // console.log('it is greater than max?');
            const validationError = new Object() as ValidationError;
            validationError.index = rowIndex;
            validationError.error = `The field ${this.headers[field].name} (${field})
              must be lower than ${this.headers[field].max}`;
            this.dataValidationErrors.push(validationError);
            currentRowErrors.push(validationError);
            errorFound = true;
            console.error(`The field ${this.headers[field].name} (${field})
            must be lower than ${this.headers[field].max} in the record ${rowIndex}`);
          }
          // comprobando si el campo es unico
          exists = 0;
          copyData.forEach((element, index) => {
            // console.log(`index & rowIndex ${index}, ${rowIndex}`);
            if (index !== rowIndex) {
              // console.log(`exists!!`);
              exists += element[field] == row[field] ? 1 : 0;
            }
          });
          console.log(`field ${field} repeat ${exists} times`);
          // comprobando si el campo es unico
          if (this.headers[field].unique &&  exists > 0) {
            const validationError = new Object() as ValidationError;
            validationError.index = rowIndex;
            validationError.error = `The field ${this.headers[field].name} (${field})
              must be unique in all the collection. It repits ${exists} times`;
            this.dataValidationErrors.push(validationError);
            currentRowErrors.push(validationError);
            errorFound = true;
            console.error(`Theld ${this.headers[field].name} (${field})
            must be unique in all the collection, in the record ${rowIndex}. It repits ${exists} times`);
          }
          /*
            Comprobacion de datos compuestos (usando varias columnas), dependiendo del tipo de importacion
            seleccionado
          */
          if (this.dataProvider.getDataType() === 'items') {
            // console.log('validating compound items data');
            if (field === 'itemType') {
              rowToSave[field] = new Object() as ItemType;
              rowToSave[field].code = row[field] as string;
              rowToSave[field].name = '';
            }
            if (field === 'uom') {
              rowToSave[field] = new Object() as UnityOfMeasure;
              rowToSave[field].code = row[field] as string;
              rowToSave[field].name = '';
            }
          } else if (this.dataProvider.getDataType() === 'locations') {
            // console.log('validating compound locations data');
            // No hay datos compuestos por validar
          } else if (this.dataProvider.getDataType() === 'orders') {
            // console.log('validating compound orders data');
            if (field === 'transport') {
              rowToSave['transport'] = new Object() as Transport;
              rowToSave[field].transportNumber = row[field];
              rowToSave[field].route = row['route'] ? row['route'] : '';
              rowToSave[field].name = row['routeName'] ? row['routeName'] : '';
              rowToSave[field].dispatchPlatforms = row['dispatchPlatforms'] ? row['dispatchPlatforms'] : '';
              rowToSave[field].carrierCode = row['carrierCode'] ? row['carrierCode'] : '';
            }
            if (field === 'customerNumber') {
              rowToSave['customer'] = new Object() as Customer;
              rowToSave['customer'].code = row[field];
              rowToSave['customer'].name = row['customerName'] ? row['customerName'] : '';
              rowToSave['customer'].address = row['address'] ? row['address'] : '';
            }
            if (field === 'sku') {
              const orderLine = new Object() as OrderLine;
              orderLine.item = new Object() as Item;
              orderLine.item.sku = row['sku'];
              orderLine.item.description = row['description'] ? row['description'] : '';
              orderLine.item.itemType = row['itemType'] ? row['itemType'] : '';
              orderLine.item.uom = row['codeUom'] ? row['codeUom'] : '';

              orderLine.qtyToPicked = row['qtyToPicked'] ? row['qtyToPicked'] : '';
              orderLine.expiryDate = row['expiryDate'] ? row['expiryDate'] : '';
              orderLine.serial = row['serial'] ? row['serial'] : '';

              orderLine.location = new Object() as Location;
              orderLine.location.code = row['codeLocation'] ? row['codeLocation'] : '';

              orderLine.baseItemOverride = row['baseItemOverride'] ? row['baseItemOverride'] : '';
              orderLine.caseLabelCheckDigits = row['caseLabelCheckDigits'] ? row['caseLabelCheckDigits'] : '';
              orderLine.cartonCode = row['cartonCode'] ? row['cartonCode'] : '';
              orderLine.cartonCode = row['pickSequenceNumber'] ? row['pickSequenceNumber'] : '';
              orderLine.workCode = row['workCode'] ? row['workCode'] : '';

              rowToSave['orderLine'] = orderLine;
            }
            if (field === 'departureDateTime' || field === 'departureDateTime') {
              rowToSave[field] = new Date(row[field]);
            }
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
          console.error(`invalid row ${rowIndex}`, this.dataSource.data[rowIndex]);
          return;
        } else {
          this.dataSource.data[rowIndex].tooltip = null;
          this.dataSource.data[rowIndex].invalid = false;
          console.log(`valid row ${rowIndex}`, this.dataSource.data[rowIndex]);
        }
        // lo añadimos a la lista de datos a enviar, en caso de que cumpla con todas las validaciones
        this.dataToSend.push(rowToSave);
      });

      this.validationRequested = true;
      this.isLoadingResults = false;
      this.isReadyToSend = this.dataValidationErrors.length === 0;
      console.log('data to send', this.dataToSend);
      console.log('ready to send? ', this.isReadyToSend);
      console.log('validation errors', this.dataValidationErrors);
      console.log('validation errors per row', this.invalidRows);
      if (this.dataValidationErrors.length > 0) {
        this.utilities.showSnackBar(`There are ${this.invalidRows.length} invalid records`, 'OK');
      }
    } else {
      console.log('There is not data in the table');
      this.utilities.showSnackBar(`There is no data to import`, 'OK');
    }
  }

  editRow(index: number) {
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        data: {
          row: this.dataSource.data[index],
          map: this.utilities.dataTypesModelMaps[this.dataProvider.getDataType()]
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog result:', result);
      if (result) {
        Object.keys(result).forEach(key => {
          this.dataSource.data[index][key] = result[key];
        });
      }
    });
  }

  getValidationAlertMessage() {
    return this.dataValidationErrors.length > 0 ?
    `There are ${this.invalidRows.length} invalid records wich you neeed to fix.
    Please, fix them and try again` :
    'Data validated successfully. Press next to continue';
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

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
