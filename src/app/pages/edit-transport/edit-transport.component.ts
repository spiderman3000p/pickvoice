import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { Transport, Order, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { SharedDataService } from '../../services/shared-data.service';
import { merge, Subscription, Observer } from 'rxjs';
import { takeLast, retry } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface TransportData {
  uomsList: UnityOfMeasure[];
  statusList: string[];
}
@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.scss']
})

export class EditTransportComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.TRANSPORTS;
  dataMap = ModelMap.TransportMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  transportData: TransportData;
  /* para tabla de orders */
  definitions: any = ModelMap.OrderListMap;
  dataSource: MatTableDataSource<Order>;
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  subscriptions: Subscription[] = [];
  selectsData: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService, private router: Router, private dialog: MatDialog
  ) {
    this.transportData = new Object() as TransportData;
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Transport' : 'View Transport';
    this.isLoadingResults = true;
    this.form = new FormGroup({
      transportNumber: new FormControl(''),
      route: new FormControl(''),
      nameRoute: new FormControl(''),
      carrierCode: new FormControl(''),
      shipmentDate: new FormControl(''),
      vehicle: new FormControl(''),
      trailer: new FormControl(''),
      containerNumber: new FormControl(''),
      uomWeightId: new FormControl(''),
      weight: new FormControl(''),
      uomVolumeId: new FormControl(''),
      transportationStatus: new FormControl(''),
      description: new FormControl(''),
      plannedCheckin: new FormControl(''),
      actualCheckin: new FormControl(''),
      plannedStartLoading: new FormControl(''),
      currentStartLoading: new FormControl(''),
      plannedEndLoading: new FormControl(''),
      actualEndLoading: new FormControl(''),
      plannedShipmentCompletion: new FormControl(''),
      currentShipmentCompletion: new FormControl('')
    });
    // console.log('form', this.form.value);
    /* para tabla ag-grid */
    this.displayedDataColumns = Object.keys(this.definitions);
    /* para tabla de orders */
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
    this.displayedDataColumns = Object.keys(this.definitions);
    this.displayedHeadersColumns = Object.keys(this.definitions);
    this.displayedHeadersColumns.push('options');

    this.initColumnsDefs(); // columnas a mostrarse
    this.utilities.log('filters', this.filters);

    this.utilities.log('displayed data columns', this.displayedDataColumns);
    this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
    this.initColumnsDefs(); // columnas a mostrarse
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  init() {
    this.utilities.log('transport', this.row);
    this.getUomsList();
    this.getTransportationStatusList();
    this.form = new FormGroup({
      transportNumber: new FormControl(this.row.transportNumber),
      route: new FormControl(this.row.route),
      nameRoute: new FormControl(this.row.nameRoute),
      carrierCode: new FormControl(this.row.nameRoute),
      shipmentDate: new FormControl(this.row.shipmentDate),
      vehicle: new FormControl(this.row.vehicle),
      trailer: new FormControl(this.row.trailer),
      containerNumber: new FormControl(this.row.containerNumber),
      uomWeightId: new FormControl(this.row.uomWeightId),
      weight: new FormControl(this.row.weight),
      uomVolumeId: new FormControl(this.row.uomVolumeId),
      transportationStatus: new FormControl(this.row.transportationStatus),
      description: new FormControl(this.row.description),
      plannedCheckin: new FormControl(this.row.plannedCheckin),
      actualCheckin: new FormControl(this.row.actualCheckin),
      plannedStartLoading: new FormControl(this.row.plannedStartLoading),
      currentStartLoading: new FormControl(this.row.currentStartLoading),
      plannedEndLoading: new FormControl(this.row.plannedEndLoading),
      actualEndLoading: new FormControl(this.row.actualEndLoading),
      plannedShipmentCompletion: new FormControl(this.row.plannedShipmentCompletion),
      currentShipmentCompletion: new FormControl(this.row.currentShipmentCompletion)
    });
    this.loadData();
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.id;
    delete dataToExport.ownerId;
    this.utilities.exportToXlsx(dataToExport, 'Transport # ' + this.row.transportNumber);
  }

  getUomsList() {
    this.dataProviderService.getAllUoms().subscribe(results => {
      this.transportData.uomsList = results;
      this.utilities.log('uoms list', this.transportData.uomsList);
    });
  }

  getTransportationStatusList() {
    this.transportData.statusList = Object.keys(Transport.TransportationStatusEnum);
    this.utilities.log('status list', this.transportData.statusList);
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    for (let key in formData) {
      if (1) {
        toUpload[key] = formData[key];
      }
    }
    this.utilities.log('data to upload', toUpload);
    if (this.remoteSync) {
      this.isLoadingResults = true;

      const observer = {
        next: (response) => {
          this.isLoadingResults = false;
          this.utilities.log('update response', response);
          if ((response.status === 204 || response.status === 200 || response.status === 201)) {
            this.utilities.showSnackBar('Update Successfull', 'OK');
          }
          // this.back();
        },
        error: (error) => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on edit row request', 'OK');
          this.utilities.error('error on update', error);
        }
      };
      this.dataProviderService.updateTransport(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
    } else {
      this.sharedDataService.returnData = toUpload;
      this.location.back();
    }
  }

  getColumnsClasses() {
    let classes = 'col-sm-12 col-md-4 col-lg-3';
    if (this.keys.length < 3) {
      classes = 'col-sm-12 col-md-6 col-lg-6';
    }
    return classes;
  }

  addNewObject(objectType: string, myTitle: string) {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps[objectType],
        type: objectType,
        title: myTitle,
        remoteSync: true, // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        if (objectType === IMPORTING_TYPES.UOMS) {
          this.transportData.uomsList.push(result);
        }
        // TODO: agregar los tipos de datos que se pueden agregar desde selects
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string,
      type: string
    }) => {
      this.viewMode = data.viewMode;
      this.type = data.type;
      this.utilities.log('viewMode', this.viewMode);
      data.row.subscribe(element => {
        this.isLoadingResults = false;
        this.utilities.log('ngOnInit => row received', element);
        this.row = element;
        this.cardTitle = 'Transport # ' + this.row.id;
        this.init();
      });
      this.remoteSync = true;
    });
    /* para la tabla de orders */
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  print() {
    // this.utilities.print('printSection');
    // this.router.navigate([`/pages/${this.type}/print`, this.row.id]);
    window.open(`/print/${this.type}/${this.row.id}`, '_blank');
  }

  /* Metodos para la tabla de orders */
  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInEditTransportPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInEditTransportPage'));
    } else {
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        shouldShow = index === this.displayedHeadersColumns.length - 1 || index < this.displayedHeadersColumns.length;
        return {show: shouldShow, name: columnName};
      });
    }
    aux = this.columnDefs.slice();
    aux.pop();
    this.defaultColumnDefs = aux;
    this.selectsData = {};
    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = this.definitions[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        if (this.definitions[column.name].formControl.control === 'select') {
          this.selectsData[column.name] =
          this.dataProviderService.getDataFromApi(this.definitions[column.name].type);
          formControls[column.name].patchValue(-1);
        }
        this.filters.push(filter);
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('formControls', formControls);
    this.selectsData = {};
    for (let key in this.definitions) {
      if (this.definitions[key].formControl.control === 'select') {
        this.dataProviderService.getDataFromApi(this.definitions[key].type).subscribe(result => {
          this.selectsData[key] = result;
        });
      }
    }
  }

  getDisplayedHeadersColumns() {
    return this.columnDefs.filter(col => col.show).map(col => col.name);
  }

  getDefaultHeadersColumns() {
    return this.defaultColumnDefs;
  }

  toggleColumn(column?) {
    this.utilities.log('displayed column until now', this.displayedDataColumns);

    const selectedCol = column ? this.columnDefs.find(col => col.name === column.name) : null;
    const selectedDefaultCol = column ? this.defaultColumnDefs.find(col => col.name === column.name) : null;
    if (selectedCol) {
      column.show = !column.show;
      selectedCol.show = !selectedCol.show;
      selectedDefaultCol.show = !selectedDefaultCol.show;
    } else {
      this.defaultColumnDefs.forEach(col => col.show = true);
      this.columnDefs.forEach(col => col.show = true);
    }
    // guardamos la eleccion en el local storage
    localStorage.setItem('displayedColumnsInEditTransportPage', JSON.stringify(this.columnDefs));
    this.utilities.log('displayed column after', this.columnDefs);
  }

  deleteRow(row: any) {
    const index = this.dataSource.data.findIndex(_row => _row === row);
    this.utilities.log('index to delete', index);
    this.dataSource.data.splice(index, 1);
    this.refreshTable();
    return true;
  }

  deleteRows(rows: any) {
    let deletedCounter = 0;
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRow(rows);
          this.utilities.log('Row deleted');
          if (deletedCounter === 0) {
            this.utilities.showSnackBar('Row deleted', 'OK');
          }
          deletedCounter++;
        }
      },
      error: (response) => {
        this.utilities.error('Error on delete rows', response);
        if (deletedCounter === 0) {
          if (response.error && response.error.errors && response.error.errors[0].includes('foreign')) {
            this.utilities.showSnackBar('This record cant be deleted because it is in use', 'OK');
          } else {
            this.utilities.showSnackBar('Error on delete row', 'OK');
          }
        }
        deletedCounter++;
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      const requests = [];
      rows.forEach(row => {
        requests.push(this.dataProviderService.deleteOrder(row.id, 'response', false));
      });
      this.subscriptions.push(merge(requests).pipe(takeLast(1)).subscribe(observer));
    } else {
      this.subscriptions.push(this.dataProviderService.deleteOrder(rows.id, 'response', false)
      .subscribe(observer));
    }
  }

  deletePrompt(rows?: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRows(rows);
        }
      },
      error: (error) => {

      }
    } as Observer<boolean>;
    this.utilities.showCommonDialog(observer, {
      title: 'Delete Row',
      message: 'You are about to delete this record(s). Are you sure to continue?'
    });
  }

  renderColumnData(type: string, data: any) {
    const text = this.utilities.renderColumnData(type, data);
    return typeof text === 'string' ? text.slice(0, 30) : text;
  }

  resetFilters() {
    this.filtersForm.reset();
    this.dataSource.filter = '';
  }

  applyFilters() {
    const formValues = this.filtersForm.value;
    let value;
    let value2;
    // this.utilities.log('filter form values: ', formValues);
    const filters = this.filters.filter(filter => filter.show &&
                    formValues[filter.key] && formValues[filter.key].length > 0);
    // this.utilities.log('filters: ', filters);
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      // this.utilities.log('data', data);
      return filters.every(shownFilter => {
        value = this.utilities.getSelectIndexValue(this.definitions, data[shownFilter.key], shownFilter.key);
        value2 = formValues[shownFilter.key].toString();
        /*
        this.utilities.log('data[shownFilter.key]', data[shownFilter.key]);
        this.utilities.log('shownFilter.key', shownFilter.key);
        this.utilities.log('value', value);
        this.utilities.log('value2', value2);
        this.utilities.log('--------------------------------------------');*/
        return value !== undefined && value !== null && value.toString().toLowerCase().includes(value2.toLowerCase());
      });
    };
    this.dataSource.filter = 'filtred';
  }

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editRowOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        type: IMPORTING_TYPES.ORDERS,
        remoteSync: true, // para mandar los datos a la BD por la API
        viewMode: mode
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
            this.dataSource.data[element.index] = result;
            this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  loadData(useCache = true) {
    this.utilities.log('requesting orders');
    this.isLoadingResults = true;
    this.subscriptions.push(this.dataProviderService.getTransportsOrders(this.row.id)
    .subscribe(results => {
      this.isLoadingResults = false;
      this.utilities.log('orders received', results);
      if (results && results.content && results.content.length > 0) {
        this.dataSource.data = results.content.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();
      } else if (results && results.length > 0 && results.content === undefined) {
        this.dataSource.data = results.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.orders);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.ORDERS,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Order',
        defaultValues: {
          transport: this.row
        }
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.dataSource.data.push(result);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  exportOrders() {
    const dataToExport = this.dataSource.data.map((row: any) => {
      return this.utilities.getJsonFromObject(row, IMPORTING_TYPES.ORDERS_LIST);
    });
    this.utilities.exportToXlsx(dataToExport, 'Orders List');
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  updateOrder(event) {
    console.log(event);
    const order = event.data;
    console.log('updateOrder', event);
    this.dataProviderService.updateOrder(order, order.id).subscribe(result => {
      this.utilities.log('order update result', result);
      if (result) {
        this.utilities.showSnackBar('Order updated successfully', 'OK');
      }
    }, error => {
      this.utilities.error('Error on update order', error);
      this.utilities.showSnackBar('Error on update order', 'OK');
    });
  }

  deleteOrder(order: any) {
    this.utilities.log('edit-transport. deleteOrder', order);
    this.dataProviderService.deleteOrder(order.id).subscribe(results => {
      this.utilities.log('delete order results', results);
      if (results) {
        this.utilities.showSnackBar('Order deleted successfully', 'OK');
        this.refreshTable();
      }
    }, error => {
      this.utilities.error('Error on delete order', error);
      this.utilities.showSnackBar('Error on delete order', 'OK');
    });
  }
  /* fin de metodos para la tabla de orders */
}
