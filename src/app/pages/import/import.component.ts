import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { SharedDataService } from '../../services/shared-data.service';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, retry, tap, last } from 'rxjs/operators';
import { Item, ItemType, Customer, OrderLine, OrderDto, Order, Transport, Location, UnityOfMeasure,
         Section, LoadPick } from '@pickvoice/pickvoice-api';
import { DataProviderService} from '../../services/data-provider.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  headers: any; // contendra las cabeceras de las columnas a mostrar en la tabla
  validationRequested = false;
  dataSource: MatTableDataSource<any>;
  dataToSendLength: number;
  displayedColumns = []; // contendra las columnas de la entidad a impotar: items, locations u orders
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  subscription: Subscription;
  loadingText = '';
  isProcessingData = false;
  isUploadingData = false;
  isDataSaved = false;
  isReadyToSend = false;
  errorOnSave = false;
  uploadingDone = false;
  mapingProgress = 0;
  mapedRows = 0;
  processedRows = 0;
  importedRows = 0;
  rejectedRows = 0;
  selectedType: string;
  importingProgressMode: string;
  processingProgress: number;
  uploadingProgress: number;
  downloadingProgress: number;
  uploadingResponseMessage: string;
  showProcessingPopup = false;
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
    private dialog: MatDialog, private utilities: UtilitiesService, private dataProviderService: DataProviderService,
    private sharedDataService: SharedDataService, private recentOriginsService: RecentOriginsService) {
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
    this.processingProgress = 0;
    this.uploadingProgress = 0;
    this.downloadingProgress = 0;
    this.importingProgressMode = 'determinate';
    this.uploadingResponseMessage = '';
  }

  importWidget() {
    const dialogRef = this.dialog.open(ImportingWidgetComponent,
      {
        width: '90vw',
        height: '90vh'
      });
    dialogRef.afterClosed().subscribe(jsonResult => {
      this.utilities.log('dialog result:', jsonResult);
      this.selectedType = this.sharedDataService.getDataType();

      if (jsonResult && jsonResult.length > 0) {
        const receivedKeys: any[] = Object.keys(jsonResult[0]);
        const headers = this.utilities.dataTypesModelMaps[this.selectedType];
        let displayedColumns = Object.keys(headers);
        // eliminar campos por defecto
        if (this.selectedType === IMPORTING_TYPES.ITEMS) {
          displayedColumns = displayedColumns.filter(column => column !== 'itemState');
        }
        this.utilities.log('displayedColumns in import component', displayedColumns);

        if (!this.utilities.equalArrays(receivedKeys, displayedColumns)) {
          this.utilities.log('received keys', receivedKeys);
          this.utilities.log('required keys', displayedColumns);
          this.utilities.error('the received data schema is invalid');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
        // agregamos el campo indice a todos los elementos del resultado
        // jsonResult = jsonResult.map((element, i) => new Object({index: i, ...element}));
        if (this.dataSource === undefined) {
          this.dataSource = new MatTableDataSource<any>(jsonResult);
        } else {
          this.dataSource.data = []; // importante limpiar la data primero
          this.displayedColumns = displayedColumns; // importante establecer las nuevas columnas a mostrar
          this.headers = headers; // importante establecer las nuevas cabeceras
          // this.dataSource.data = jsonResult; // formar objetos a partir del json
        }
        this.initMapData(jsonResult);
      }
    });
  }

  initMapData(jsonData) {
    if (typeof Worker !== 'undefined') {
      this.loadingText = 'Maping Data... Please, wait';
      this.showProcessingPopup = true;
      this.dataSource.data = [];
      // Create a new
      const worker = new Worker('./import.worker', {type: 'module'});
      worker.onmessage = ({ data }) => {
        // console.log(`page got message:`, data);
        if (data.type === 'error') {
          this.utilities.error(data.message, data.data ? data.data : '');
          this.utilities.showSnackBar(data.message, 'OK');
        }
        if (data.type === 'event') {
          // this.utilities.log('maping message', data);
          this.processWorkerMapingResponse(data, jsonData.length);
        }
      };
      const dataMessage = {
        action: 'mapData',
        selectedType: this.selectedType,
        data: jsonData,
        offset: environment.importOffset
      };
      worker.postMessage(dataMessage);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.utilities.error(`Web Workers no es soportado por este navegador. Por favor actualice su navegador`);
      this.utilities.showSnackBar('This web browser cant use web workers. Please, update your web browser', 'OK');
    }
  }

  processWorkerMapingResponse(data, dataLength) {
    if (data.mapedRowsBatch !== undefined && data.mapedRowsBatch !== null) {
      this.mapedRows = data.mapedRowsCounter;
      this.mapingProgress = Math.floor((data.mapedRowsCounter * 100) / dataLength);
      this.dataSource.data = this.dataSource.data.concat(data.mapedRowsBatch);
      // console.log('table data until now', this.dataSource.data);
      if (data.mapedRowsCounter === dataLength) {
        this.initValidateData();
      }
    }
  }

  initValidateData() {
    if (this.dataSource.data === undefined || this.dataSource.data === null || this.dataSource.data.length === 0) {
      this.utilities.error('table data is empty or invalid. Can not validate');
      return;
    }
    this.importedRows = 0;
    this.rejectedRows = 0;
    const jsonData = this.dataSource.data;
    const dataLength = Number(jsonData.length);
    if (typeof Worker !== 'undefined') {
      this.showProcessingPopup = true;
      // Create a new
      const worker = new Worker('./import.worker', {type: 'module'});
      worker.onmessage = ({ data }) => {
        // console.log(`page got message:`, data);
        if (data.type === 'error') {
          this.utilities.error(data.message, data.data ? data.data : '');
          this.utilities.showSnackBar(data.message, 'OK');
        }
        if (data.type === 'event') {
          // this.utilities.log('validating message', data);
          this.processWorkerValidationResponse(data, dataLength);
        }
      };
      const dataMessage = {
        action: 'validateData',
        selectedType: this.selectedType,
        data: jsonData,
        offset: environment.importOffset
      };
      this.validationRequested = true;
      this.isProcessingData = true;
      worker.postMessage(dataMessage);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.utilities.error(`Web Workers no es soportado por este navegador, por favor actualice su navegador`);
      this.utilities.showSnackBar('This web browser cant use web workers, please update your web browser', 'OK');
    }
  }

  processWorkerValidationResponse(data, dataLength) {
    if (data.validatedRowsBatch !== undefined && data.validatedRowsBatch !== null) {
        this.processedRows = data.processedRowsCounter;
        this.processingProgress = Math.floor((data.processedRowsCounter * 100) / dataLength);
        if (data.validatedRowsBatch) {
          data.validatedRowsBatch.forEach(row => {
            this.dataSource.data[row.index].tooltip = row.tooltip;
            this.dataSource.data[row.index].invalid = row.invalid;
          });
        }
        if (data.processedRowsCounter === dataLength) {
          this.initUploadProccess();
        }
    }
  }

  initUploadProccess() {
    this.isProcessingData = false;
    this.downloadingProgress = 0;
    this.errorOnSave = false;
    this.isDataSaved = false;
    this.uploadingProgress = 0;
    this.uploadingDone = false;
    this.isUploadingData = false;
    this.importedRows = 0;
    this.rejectedRows = 0;
    const dataToSend = this.getValidRows();
    this.dataToSendLength = dataToSend.length;
    this.isReadyToSend = dataToSend.length > 0;
    this.utilities.log('ready to send? ', this.isReadyToSend);
    if (this.isReadyToSend) {
      this.utilities.log('sending data to api:', dataToSend);
      this.startUploadProcess(dataToSend);
    }
    if (!this.isReadyToSend) {
      this.utilities.error('Data are not ready to be sent', this.dataSource.data);
      // this.utilities.showSnackBar('Data are not ready to be sent', 'OK');
      // this.utilities.showSnackBar(`There are ${this.invalidRows.length} invalid records`, 'OK');
    }
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

  startUploadProcess(dataToSend: any[]) {
    let request;
    this.isUploadingData = true;
    this.uploadingDone = false;
    this.uploadingProgress = 0;
    if (this.selectedType === IMPORTING_TYPES.ITEMS) {
      request = this.sendItemsData(dataToSend);
    } else if (this.selectedType === IMPORTING_TYPES.LOCATIONS) {
      request = this.sendLocationsData(dataToSend);
    } else if (this.selectedType === IMPORTING_TYPES.ORDERS_DTO) {
      request = this.sendOrdersData(dataToSend);
    } else if (this.selectedType === IMPORTING_TYPES.LOADPICKS_DTO) {
      request = this.sendLoadPicksData(dataToSend);
    }

    this.subscription = request.pipe(map(event => this.getEventMessage(event)))
    .subscribe(result => {
      if (result && result instanceof HttpResponse && result.body ) {
        this.isUploadingData = false;
        this.uploadingDone = true;
        this.handleApiCallResult(result, dataToSend);
      }
    }, error => {
      this.utilities.error('Error en request', error);
      // this.utilities.showSnackBar('Error saving items', 'OK');
      this.isDataSaved = false;
      this.isUploadingData = false;
      this.errorOnSave = true;
      this.isReadyToSend = false;
      this.uploadingDone = true;
      if (error && error.error && error.error.message) {
        this.uploadingResponseMessage = error.error.message;
      } else {
        this.uploadingResponseMessage = 'Unknown error';
      }
    });
  }

  cancelImportingProcess() {
    this.showProcessingPopup = false;

    if (this.subscription) {
      this.utilities.log('canceling http request...');
      this.subscription.unsubscribe();
    }
    this.isDataSaved = false;
    this.downloadingProgress = 0;
    this.errorOnSave = false;
    this.importedRows = 0;
    this.validationRequested = false;
    this.uploadingProgress = 0;
    this.uploadingDone = false;
    this.rejectedRows = 0;
    this.processingProgress = 0;
    this.processedRows = 0;
    this.mapingProgress = 0;
    this.isProcessingData = false;
    this.isUploadingData = false;
    this.isReadyToSend = false;
  }

  getDownloadingMessage() {
    if (this.isUploadingData && !this.uploadingDone) {
      return 'We are waiting response from server';
    }
    if (!this.isUploadingData && this.uploadingDone) {
      return 'Response received';
    }
    return '';
  }

  getDownloadingResponse() {
  }

  getEventMessage(event: any): string {
    // this.utilities.log('event recived:', event);
    switch (event.type) {
      case HttpEventType.Sent: {
        // this.utilities.log(`making http request...`);
        break;
      }
      case HttpEventType.UploadProgress: {
        const progress = Math.round(100 * event.loaded / event.total);
        this.uploadingProgress = progress;
        // this.utilities.log(`uploaded ${progress}%`);
        break;
      }
      case HttpEventType.DownloadProgress: {
        this.downloadingProgress = event.loaded;
        // this.utilities.log(`downloaded ${this.downloadingProgress}%`);
        break;
      }
      case HttpEventType.Response: {
        return event;
      }
    }
    return null;
  }

  sendItemsData(dataToSend: any[]) {
    this.utilities.log('sending items');
    return this.dataProviderService.createItems(dataToSend, 'events', true);
  }

  sendLocationsData(dataToSend: any[]) {
    this.utilities.log('sending locations');
    return this.dataProviderService.createLocations(dataToSend, 'events', true);
  }

  sendOrdersData(dataToSend: any[]) {
    this.utilities.log('sending orders');
    return this.dataProviderService.createOrders(dataToSend, 'events', true);
  }

  sendLoadPicksData(dataToSend: any[]) {
    this.utilities.log('sending load picks');
    return this.dataProviderService.createLoadPicks(dataToSend, 'events', true);
  }

  handleApiCallResult(result: any, dataToSend: any[]) {
    let snackMessage = '';
    this.importedRows = 0;
    this.rejectedRows = 0;
    // result as HttpResponse is expected
    this.utilities.log('api call result', result);
    if (result && result.status === 201 && result.ok && result.body) {
      this.rejectedRows = result.body.rowErrors === null ? 0 : result.body.rowErrors.length;
      this.importedRows = dataToSend.length - this.rejectedRows;
      if (this.importedRows > 0) {
        const newOrigin = new RecentOrigin();
        newOrigin.filename = this.sharedDataService.getFileName();
        newOrigin.filepath = this.sharedDataService.filePath;
        newOrigin.totalRows = dataToSend.length; // numero de registros
        newOrigin.importedRows = this.importedRows; // numero de registros aceptados en la bd api
        newOrigin.rejectedRows = this.rejectedRows; // numero de registros no aceptados en la bd api
        this.addRecentOrigin(newOrigin, this.sharedDataService.getDataType());
      }
      if ((result.body.code === 200 || result.body.code === 201) &&
           result.body.rowErrors === null && result.body.status === 'OK') {
        this.isDataSaved = true;
        this.errorOnSave = false;
        snackMessage = `All data imported successfully`;
        this.uploadingResponseMessage = snackMessage;
        this.utilities.log(snackMessage);
      } else if (result.body.code === 500 && result.body.rowErrors !== null &&
        result.body.status === 'INTERNAL_SERVER_ERROR') {
        this.utilities.error('Some data could not be saved', result.body.message);
        this.errorOnSave = true;
        this.isReadyToSend = false;
        snackMessage = result.body.message ? result.body.message : `Error saving data`;
        this.uploadingResponseMessage = snackMessage;
        this.utilities.error(snackMessage);
        this.showErrorsOnTable(result.body.rowErrors);
      } else {
        this.rejectedRows = 0;
        this.importedRows = 0;
        this.isDataSaved = false;
        this.errorOnSave = true;
        this.isReadyToSend = false;
        this.uploadingResponseMessage = 'Error saving data. Some error ocurred';
      }
      /*
        Dejamos en la tabla solo los registros invalidos, si no hay registros invalidos la tabla
        quedara vacia y no se mostrara en pantalla.
      */
      this.dataSource.data = this.getInvalidRows();
      this.refreshTable();
    }
    // this.utilities.showSnackBar(snackMessage, 'OK');
  }

  retryUploading() {
    this.initUploadProccess();
  }

  showErrorsOnTable(errors: any[]) {
    let dataRow: any;
    this.utilities.log('first element in data source', this.dataSource.data[0]);
    errors.forEach(error => {
      const existentIndex = this.dataSource.data.findIndex(row => {
        if (this.selectedType === IMPORTING_TYPES.ITEMS) {
          if ((row && row.sku && error && error.element && error.element.sku) &&
             (row.sku == error.element.sku)) {
            return true;
          }
        }
        if (this.selectedType === IMPORTING_TYPES.LOCATIONS) {
          if ((row && row.code && error && error.element && error.element.code) &&
             (row.code == error.element.code)) {
            return true;
          }
        }
        if (this.selectedType === IMPORTING_TYPES.ORDERS_DTO) {
          if ((row && row.code && error && error.element && error.element.code) &&
             (row.code == error.element.code)) {
            return true;
          }
        }
        if (this.selectedType === IMPORTING_TYPES.LOADPICKS_DTO) {
          if ((row && row.cartonCode && error && error.element && error.element.cartonCode) &&
             (row.cartonCode == error.element.cartonCode)) {
            return true;
          }
        }
        return false;
      });
      if (existentIndex > -1) {
        dataRow = this.dataSource.data[existentIndex];
      }
      if (dataRow !== undefined && dataRow !== null) {
        dataRow.invalid = true;
        dataRow.tooltip = '';
        for (const errorType in error.errors) {
          if (1) {
            dataRow.tooltip += error.errors[errorType] + ',';
          }
        }
      } else {
        this.utilities.error('row no encontrada en la tabla para marcar error. elemento:',
        error.element);
      }
    });
  }

  editRow(rowToEdit: any) {
    this.utilities.log('row to send to edit dialog', rowToEdit);
    this.utilities.log('map to send to edit dialog',
    this.utilities.dataTypesModelMaps[this.selectedType]);
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        data: {
          row: rowToEdit,
          map: this.utilities.dataTypesModelMaps[this.selectedType],
          type: this.selectedType,
          viewMode: 'edit',
          remoteSync: false // para mandar los datos a la BD por la API
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (JSON.stringify(result) !== JSON.stringify(rowToEdit)) {
          result.invalid = false;
          result.tooltip = '';
        }
        result.invalid = false;
        result.tooltip = '';
        this.utilities.log('dialog result:', result);
        rowToEdit = result;
        this.refreshTable();
      } else {
        this.utilities.log('dialog result is invalid', result);
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

  getInvalidRows() {
    return this.dataSource.data.filter(row => row.invalid === true);
  }

  getValidRows() {
    return this.dataSource.data.filter(row => row.invalid === false);
  }

  getValidationAlertMessage() {
    let message = '';
    const invalidRows = this.getInvalidRows().length;
    if (invalidRows > 0) {
      message = `There are ${invalidRows} invalid records. Please, fix them and try again`;
    } else if (invalidRows === 0 && !this.isDataSaved && !this.errorOnSave) {
      message = 'Data validated successfully';
    } else if (invalidRows === 0 && this.errorOnSave) {
      message = 'Error on saving data' + (this.uploadingResponseMessage && this.uploadingResponseMessage.length > 0 ?
      (': ' + this.uploadingResponseMessage) :  '');
    } else if (this.isDataSaved) {
      message = 'Data saved successfully';
    }
    return message;
  }

  addRecentOrigin(newOrigin: RecentOrigin, type: string) {
    this.recentOriginsService.addRecentOrigin(type, newOrigin).subscribe();
  }

  ngOnInit() {
    this.initPaginatorSort();
  }
}
