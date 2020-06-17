import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { Order, OrderService, Customer, OrderLine, OrderType, Transport, CustomerService,
         OrderTypeService, TransportService, UomService, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { PrintComponent } from '../../components/print/print.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { SharedDataService } from '../../services/shared-data.service';
import { from, Observable, Observer } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface OrdersData {
  orderTypeList: OrderType[];
  transportList: Transport[];
  customerList: Customer[];
  orderLineList: OrderLine[];
  transportStatus: string[];
  uomList: UnityOfMeasure[];
}
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})

export class EditOrderComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  selectedCustomer: any = {};
  selectedTransport: any = {};
  type = IMPORTING_TYPES.ORDERS;
  dataMap = ModelMap.OrderMap;
  definitions = ModelMap.OrderLineMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  ordersData: OrdersData;

  columnDefs: any[] = [];
  dataSource: MatTableDataSource<OrderLine>;
  displayedDataColumns: string[] = [];
  displayedHeadersColumns: any[] = [];
  defaultColumnDefs: any[] = [];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  selection = new SelectionModel<OrderLine>(true, []);
  transportDataMap = ModelMap.TransportMap;
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
    private orderService: OrderService, private router: Router, private dialog: MatDialog,
    private orderTypeService: OrderTypeService, private customerService: CustomerService,
    private transportService: TransportService, private uomService: UomService,
    private authService: AuthService, private dataProviderService: DataProviderService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.ordersData = new Object() as OrdersData;
    this.ordersData.customerList = [];
    this.ordersData.orderLineList = [];
    this.ordersData.orderTypeList = [];
    this.ordersData.transportList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Order' : 'View Order';
    this.isLoadingResults = true;
    this.form = new FormGroup({
      orderNumber: new FormControl(''),
      purchaseNumber: new FormControl(''),
      invoiceNumber: new FormControl(''),
      orderDate: new FormControl(''),
      deliveryDate: new FormControl(''),
      orderTypeId: new FormControl(''),
      priority: new FormControl(''),
      note: new FormControl(''),
      transportId: new FormControl(''),
      customerId: new FormControl('')
    });
    this.form.get('transportId').valueChanges.subscribe(value => {
      this.row.transportId = value;
      this.getTransportDetails();
    });
    this.form.get('customerId').valueChanges.subscribe(value => {
      this.row.customerId = value;
      this.getCustomerDetails();
    });
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  init() {
    this.utilities.log('order', this.row);
    this.getTransportList();
    this.getCustomerList();
    this.getOrderTypeList();
    this.getUomList();
    this.getOrderLineList();
    this.getTransportStatusList();
    this.form.get('transportId').patchValue(this.row.transportId);
    this.form.get('customerId').patchValue(this.row.customerId);
    // inicializamos todo lo necesario para la tabla
    if (this.row) {
      this.dataSource.data = this.ordersData.orderLineList;
      // inicializar tabla mat-table
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla
    }
    this.form = new FormGroup({
      orderNumber: new FormControl(this.row.orderNumber ? this.row.orderNumber : '', Validators.required),
      purchaseNumber: new FormControl(this.row.purchaseNumber ? this.row.purchaseNumber : ''),
      invoiceNumber: new FormControl(this.row.invoiceNumber ? this.row.invoiceNumber : ''),
      orderDate: new FormControl(this.row.orderDate ? this.row.orderDate : ''),
      deliveryDate: new FormControl(this.row.deliveryDate ? this.row.deliveryDate : ''),
      orderTypeId: new FormControl(this.row.orderTypeId ? this.row.orderTypeId : ''),
      priority: new FormControl(this.row.priority ? this.row.priority : ''),
      note: new FormControl(this.row.note ? this.row.note : ''),
      // idTransport: new FormControl(this.row.idTransport),
      transportId: new FormControl(this.row.transportId ? this.row.transportId : ''),
      customerId: new FormControl(this.row.customerId ? this.row.customerId : '')
    });
    this.form.get('transportId').valueChanges.subscribe(value => {
      this.row.transportId = value;
      this.getTransportDetails();
    });
    this.form.get('customerId').valueChanges.subscribe(value => {
      this.row.customerId = value;
      this.getCustomerDetails();
    });
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInOrderLinesPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInOrderLinesPage'));
    } else {
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        shouldShow = index === 0 || index === this.displayedHeadersColumns.length - 1 || index < 7;
        return {show: shouldShow, name: columnName};
      });
    }
    aux = this.columnDefs.slice();
    aux.pop();
    aux.shift();
    this.defaultColumnDefs = aux;
    this.utilities.log('columnDefs ', this.columnDefs);
    this.utilities.log('defaultColumnDefs ', this.defaultColumnDefs);

    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = this.definitions[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        // this.utilities.log(`new formControl formControls[${column.name}]`, formControls[column.name]);
        // this.utilities.log('formControls', formControls);
        filter.control = formControls[column.name];
        filter.formControl = this.definitions[column.name].formControl;
        this.filters.push(filter);
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('formControls', formControls);
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
    localStorage.setItem('displayedColumnsInOrderLinesPage', JSON.stringify(this.columnDefs));
    // this.utilities.log('displayed column after', this.columnDefs);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  actionForSelectedRows(action) {
    // this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selection.selected.length > 0) {
          this.deleteOrderLinePrompt(this.selection.selected);
        } else {
          this.utilities.showSnackBar('You have no selected records', 'OK');
        }
        break;
      default: break;
    }
  }

  deleteRow(row: any) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    }
    const index = this.dataSource.data.findIndex(_row => _row === row);
    // this.utilities.log('index to delete', index);
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
      error: (error) => {
        this.utilities.error('Error on delete rows', error);
        if (deletedCounter === 0) {
          this.utilities.showSnackBar('Error on delete rows', 'OK');
        }
        deletedCounter++;
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        // TODO: tener servicio para eliminar registros de orderLines
        // this.orderService.deleteOrderLine(row.id, 'response', false).subscribe(observer);
        this.deleteOrderLine(row);
      });
    } else {
      this.deleteOrderLine(rows);
    }
  }

  deleteOrderLine(row: any) {
    /*const index = this.dataSource.data.findIndex(_row => _row.idOrder === row.id);
    this.row.orderLines.splice(index, 1);*/
  }

  deleteOrderLinePrompt(rows?: any) {
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

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  renderColumnData(type: string, data: any) {
    const text = this.utilities.renderColumnData(type, data);
    return typeof text === 'string' ? text.slice(0, 30) : text;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editOrderLineOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editOrderLineOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        viewMode: mode,
        type: IMPORTING_TYPES.ORDER_LINE,
        remoteSync: false // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
            this.dataSource.data[element.index] = result;
            this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  addOrderLine() {
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.ORDER_LINE,
        title: 'Add Order Line',
        remoteSync: false // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.dataSource.data.push(result);
        this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = this.row;
    this.utilities.exportToXlsx(dataToExport, 'Order ' + this.row.orderNumber);
  }

  exportOrderLines() {
    const dataToExport = this.dataSource.data.slice().map((row: any) => {
      delete row.id;
      delete row.index;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Order Lines List');
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

  applyFilters() {
  }

  getCustomerDetails() {
    if (this.row.customerId) {
      this.dataProviderService.getCustomer(this.row.customerId).subscribe(results => {
        this.selectedCustomer = results;
        this.utilities.log('selected customer details: ', this.selectedCustomer);
      });
    }
  }

  getTransportDetails() {
    if (this.row.transportId) {
      this.dataProviderService.getTransport(this.row.transportId).subscribe(results => {
        this.selectedTransport = results;
        this.utilities.log('selected transport details: ', this.selectedTransport);
      });
    }
  }

  getOrderTypeList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.ORDER_TYPE).subscribe(results => {
      this.ordersData.orderTypeList = results;
      this.utilities.log('this.ordersData.orderTypeList', this.ordersData.orderTypeList);
    });
  }

  getOrderLineList() {
    this.orderService.orderLineByOrderId(this.row.id).subscribe((results: any) => {
      this.ordersData.orderLineList = results;
      this.dataSource.data = results;
      this.refreshTable();
      this.utilities.log('this.ordersData.orderLineList', this.ordersData.orderLineList);
    });
  }

  getCustomerList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.CUSTOMERS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.customerList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.customerList = results;
      }
      this.utilities.log('this.ordersData.customerList', this.ordersData.customerList);
    });
  }

  getTransportList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.TRANSPORTS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.transportList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.transportList = results;
      }
      this.utilities.log('this.ordersData.transportList', this.ordersData.transportList);
    });
  }

  getUomList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.UOMS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.uomList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.uomList = results;
      }
      this.utilities.log('this.ordersData.uomList', this.ordersData.uomList);
    });
  }

  getTransportStatusList() {
    this.dataProviderService
    .getDataFromApi(IMPORTING_TYPES.TRANSPORT_STATE).subscribe(results => {
      this.ordersData.transportStatus = results;
    });
  }

  print() {
    // this.utilities.print('printSection');
    // this.router.navigate([`/pages/${this.type}/print`, this.row.id]);
    window.open(`/print/${this.type}/${this.row.id}`, '_blank');
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    formData.orderLines = this.dataSource.data;

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
          if ((response.status === 204 || response.status === 200 || response.status === 201)
            && response.statusText === 'OK') {
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
      this.orderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
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
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps[objectType],
        type: objectType,
        title: myTitle,
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        if (objectType === IMPORTING_TYPES.TRANSPORTS) {
          this.ordersData.transportList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ORDER_TYPE) {
          this.ordersData.orderTypeList.push(result);
        }
        if (objectType === IMPORTING_TYPES.CUSTOMERS) {
          this.ordersData.customerList.push(result);
        }
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        const keys = Object.keys(element).filter(key => key !== 'id');
        const keysForItem = keys.filter(key => key !== 'state');
        this.cardTitle = 'Order # ' + this.row.orderNumber;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
