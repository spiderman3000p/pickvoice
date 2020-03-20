import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService,
         ItemTypeService, OrderService, Customer, OrderLine, UomService, Section, OrderType,
         SectionService, Transport, CustomerService, OrderTypeService } from '@pickvoice/pickvoice-api';
import { PrintComponent } from '../../components/print/print.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { DataStorage } from '../../services/data-provider';
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

interface ItemsData {
  itemTypeList: ItemType[];
  unityOfMeasureList: UnityOfMeasure[];
  itemStateList: string[];
}

interface LocationsData {
  sectionList: Section[];
  typeList: string[];
}

interface OrderLinesData {
  ordersList: Order[];
  itemsList: Item[];
}

interface OrdersData {
  orderTypeList: OrderType[];
  transportList: Transport[];
  customerList: Customer[];
}
@Component({
  selector: 'app-edit-row',
  templateUrl: './edit-row.component.html',
  styleUrls: ['./edit-row.component.scss']
})

export class EditRowComponent implements OnInit {
  definitions: any = ModelMap.OrderLineMap;
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  itemsData: ItemsData; // para los datos compuestos de Item
  locationsData: LocationsData; // para los datos compuestos de Location
  ordersData: OrdersData;
  orderLinesData: OrderLinesData;
  columnDefs: any[]; // para el agGrid
  rowData: any[];
  dataSource: MatTableDataSource<any>;
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dataProvider: DataStorage, private utilities: UtilitiesService, private location: WebLocation,
    private itemService: ItemsService, private locationService: LocationsService,
    private activatedRoute: ActivatedRoute, private orderService: OrderService,
    private sectionService: SectionService, private itemTypeService: ItemTypeService,
    private router: Router, private uomsService: UomService, private dialog: MatDialog,
    private orderTypeService: OrderTypeService, private customerService: CustomerService
  ) {
    // const data = this.dataProvider.sharedData;
    // this.row = data.row; // object
    // this.utilities.log('row recibida', this.row);
    // this.dataMap = data.map; // map of object
    // this.utilities.log('fields', this.dataMap);
    // this.type = data.type; // map of object
    // this.init();
    this.dataSource = new MatTableDataSource([]);
    this.itemsData = new Object() as ItemsData;
    this.locationsData = new Object() as LocationsData;
    this.ordersData = new Object() as OrdersData;
    this.orderLinesData = new Object() as OrderLinesData;
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Row' : 'View Row';
  }

  init() {
    this.utilities.log('type', this.type);
    // this.remoteSync = data.remoteSync; // map of object
    this.dataMap = this.utilities.dataTypesModelMaps[this.type];
    this.utilities.log('remoteSync', this.remoteSync);
    this.utilities.log('dataMap', this.dataMap);
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    // this.utilities.log('keys', this.keys);
    let value = '';
    // init data for selects
    if (this.type === IMPORTING_TYPES.ITEMS) {
      // this.row = ModelFactory.newEmptyItem();
      this.utilities.log('item', this.row);
      this.getItemTypeList();
      this.getUnityOfMeasureList();
      this.getItemStateList();
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      // this.row = ModelFactory.newEmptyLocation();
      this.utilities.log('location', this.row);
      this.getSectionList();
      this.getTypeList();
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      // this.row = ModelFactory.newEmptyOrder();
      this.utilities.log('order', this.row);
      this.getTransportList();
      this.getCustomerList();
      this.getOrderTypeList();
      // inicializamos todo lo necesario para la tabla
      if (this.row && this.row.orderLines && this.row.orderLines.length > 0) {
        this.dataSource.data = this.row.orderLines;
        // inicializar definicion de columnas para la tabla agGrid
        /*this.columnDefs = Object.keys(this.row.orderLines[0]).map((col: any) => {
          return {
                    field: col,
                    filter: true,
                    editable: true,
                    sortable: true
                 };
        });
        let orderLineRow;
        // inicializar definicion de filas para la tabla agGrid
        this.rowData = this.row.orderLines.map(row => {
          orderLineRow = new Object();
          for (let column in row) {
            if (1) {
              orderLineRow[column] = this.utilities.renderColumnData(ModelMap.OrderLineMap[column].type, row[column]);
              console.log(`orderLineRow[${column}]`, orderLineRow[column]);
              // console.log(`orderLineRow[${column}]`);
            }
          }
          return orderLineRow;
        });
        console.log('rowData', this.rowData);
        */
        // inicializar tabla mat-table
        this.displayedDataColumns = Object.keys(ModelMap.OrderLineMap);
        this.displayedHeadersColumns = ['select'].concat(Object.keys(ModelMap.OrderLineMap));
        this.displayedHeadersColumns.push('options');
        this.initColumnsDefs(); // columnas a mostrarse en la tabla
        // this.utilities.log('filters', this.filters);
        // this.utilities.log('displayed data columns', this.displayedDataColumns);
        // this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
      }
    }
    if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
      // this.row = ModelFactory.newEmptyItemType();
      this.utilities.log('item type', this.row);
    }
    if (this.type === IMPORTING_TYPES.UOMS) {
      // this.row = ModelFactory.newEmptyUnityOfMeasure();
      this.utilities.log('uom', this.row);
    }
    if (this.type === IMPORTING_TYPES.CUSTOMERS) {
      // this.row = ModelFactory.newEmptyUnityOfMeasure();
      this.utilities.log('customer', this.row);
    }
    if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
      // this.row = ModelFactory.newEmptyUnityOfMeasure();
      this.utilities.log('order type', this.row);
    }
    if (this.type === IMPORTING_TYPES.SECTIONS) {
      // this.row = ModelFactory.newEmptyUnityOfMeasure();
      this.utilities.log('section', this.row);
    }
    // console.log('columnDefs', this.columnDefs);
    // console.log('rowData', this.rowData);
    this.keys.forEach((key, index) => {
      if (this.row === undefined) {
        return;
      }
      value = this.utilities.renderColumnData(this.dataMap[key].type, this.row[key]);

      if (this.dataMap[key].required) {
        formControls[key] = new FormControl(value, Validators.required);
      } else {
        formControls[key] = new FormControl(value);
      }
    });
    this.form = new FormGroup(formControls);
    /*if (this.viewMode === 'view') {
      this.form.disable();
    }*/
    // this.utilities.log('formControls', formControls);
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

    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = ModelMap.OrderLineMap[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        this.utilities.log(`new formControl formControls[${column.name}]`, formControls[column.name]);
        this.utilities.log('formControls', formControls);
        filter.control = formControls[column.name];
        filter.formControl = ModelMap.OrderLineMap[column.name].formControl;
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
    this.utilities.log('displayed column after', this.columnDefs);
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
    this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selection.selected.length > 0) {
          this.deletePrompt(this.selection.selected);
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
      });
    } else {
      // this.apiService.deleteUom(rows.id, 'response', false).subscribe(observer);
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

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editRowOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: ModelMap.OrderLineMap,
        type: IMPORTING_TYPES.ORDER_LINE,
        remoteSync: true // para mandar los datos a la BD por la API
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
    this.utilities.log('map to send to add dialog', ModelMap.OrderLineMap);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: ModelMap.OrderLineMap,
        type: IMPORTING_TYPES.ORDER_LINE,
        remoteSync: true // para mandar los datos a la BD por la API
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

  exportOrderLines() {
    const dataToExport = this.dataSource.data.slice().map((row: any) => {
      delete row.id;
      delete row.index;
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

  addNewObject(objectType: string, myTitle: string) {
    this.utilities.log('map to send to add dialog', this.utilities.dataTypesModelMaps[objectType]);
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
        if (objectType === IMPORTING_TYPES.ITEM_TYPE) {
          this.itemsData.itemTypeList.push(result);
        }
        if (objectType === IMPORTING_TYPES.UOMS) {
          this.itemsData.unityOfMeasureList.push(result);
        }
        if (objectType === IMPORTING_TYPES.SECTIONS) {
          this.locationsData.sectionList.push(result);
        }
        if (objectType === IMPORTING_TYPES.TRANSPORTS) {
          this.ordersData.transportList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ORDER_TYPE) {
          this.ordersData.orderTypeList.push(result);
        }
        if (objectType === IMPORTING_TYPES.CUSTOMERS) {
          this.ordersData.customerList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ITEMS) {
          this.orderLinesData.itemsList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ORDERS) {
          this.orderLinesData.ordersList.push(result);
        }
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  getItemsList() {
    this.itemService.retrieveAllItems().subscribe(results => {
      this.orderLinesData.itemsList = results;
    });
  }

  getOrdersList() {
    this.orderService.retrieveAllOrders().subscribe(results => {
      this.orderLinesData.ordersList = results;
    });
  }

  getSectionList() {
    this.sectionService.retrieveAllSections().subscribe(results => {
      this.locationsData.sectionList = results;
    });
  }

  getTypeList() {
      this.locationsData.typeList = Object.keys(Location.TypeEnum);
  }

  getItemStateList() {
    this.itemsData.itemStateList = Object.keys(Item.ItemStateEnum);
}

  getItemTypeList() {
    this.itemTypeService.retrieveAllItemTypes().subscribe(results => {
      this.itemsData.itemTypeList = results;
    });
  }

  getUnityOfMeasureList() {
    this.uomsService.retrieveAllUom().subscribe(results => {
      this.itemsData.unityOfMeasureList = results;
    });
  }

  getOrderTypeList() {
    this.orderTypeService.retrieveAllOrderType().subscribe(results => {
      this.ordersData.orderTypeList = results;
    });
    /*this.ordersData.orderTypeList = new Observable(suscriber => {
      suscriber.next([
        { code: 'Factura', description: 'Factura'}
      ]);
      suscriber.complete();
    });*/
  }

  getCustomerList() {
    this.customerService.retrieveAllCustomers().subscribe(results => {
      this.ordersData.customerList = results;
    });
    /*this.ordersData.customerList = new Observable(suscriber => {
      suscriber.next([
        { customerNumber: 'CU01', name: 'CUSTOMER 1', contact: '', phone: '', address: ''},
        { customerNumber: 'CU02', name: 'CUSTOMER 2', contact: '', phone: '', address: ''},
      ]);
      suscriber.complete();
    });*/
  }

  getTransportList() {
    // this.ordersData.orderTypeList = this.orderTypeService.retrieveAll();
    const obs = new Observable<Transport[]>(suscriber => {
      suscriber.next([
        { transportNumber: 'T01', route: 'ROUTE 1', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T01', transportState: Transport.TransportStateEnum.Pending
        },
        { transportNumber: 'T01', route: 'ROUTE 2', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T02', transportState: Transport.TransportStateEnum.Pending
        }
      ]);
      suscriber.complete();
    }).subscribe(results => {
      this.ordersData.transportList = results;
    });
  }

  getSelectIndexValue(data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (typeof data === 'object' ?
    (data[this.dataMap[key].formControl.valueIndex] ? data[this.dataMap[key].formControl.valueIndex] : '-') :
    (typeof data === 'string' ?
    (data ? data : '-') : '-'));
  }

  getSelectDisplayData(data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (typeof data === 'object' ?
    (data[this.dataMap[key].formControl.displayIndex] ? data[this.dataMap[key].formControl.displayIndex] : '-') :
    (typeof data === 'string' ?
    (data ? data : '-') : '-'));
  }

  getSelectInputData(key: string): any[] {
    let data: any[];
    if (this.type === IMPORTING_TYPES.ITEMS) {
      switch (key) {
        case 'itemType': data = this.itemsData.itemTypeList; break;
        case 'uom': data = this.itemsData.unityOfMeasureList; break;
        case 'itemState': data = this.itemsData.itemStateList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      switch (key) {
        case 'section': data = this.locationsData.sectionList; break;
        case 'type': data = this.locationsData.typeList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      switch (key) {
        case 'orderType': data = this.ordersData.orderTypeList; break;
        case 'transport': data = this.ordersData.transportList; break;
        case 'customer': data = this.ordersData.customerList; break;
        default: break;
      }
    }
    // data.subscribe(result => console.log('data on select', result));
    // console.log(`getSelectInputData: key = '${key}', data:`, data);
    return data;
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
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      // Necesitamos guardar los cambios en el objeto recibido
      for (const key in toUpload) {
        if (this.type === IMPORTING_TYPES.ITEMS && typeof toUpload[key] === 'object' && toUpload[key] &&
          toUpload[key].code && formData[key]) {
            // mapear los datos de las propiedades tipo objeto de la entidad item
          toUpload[key].code = formData[key];
        } else if (this.type === IMPORTING_TYPES.LOCATIONS && typeof toUpload[key] === 'object' && toUpload[key] &&
          formData[key]) {
            // TODO: mapear los datos de las propiedades tipo objeto de la entidad location
        } else if (this.type === IMPORTING_TYPES.ORDERS && typeof toUpload[key] === 'object' && toUpload[key] &&
          formData[key]) {
            // TODO: mapear los datos de las propiedades tipo objeto de la entidad order
        } else if (formData[key]) {
          // las propiedades simples (que no son objetos)
          toUpload[key] = formData[key];
        }
      }
      /*if (this.type === 'items') {
        toUpload = new Object(this.form.value) as any;
        let aux = toUpload.itemType;
        toUpload.itemType = {
          code: aux
        } as ItemType;
        aux = toUpload.uom;
        toUpload.uom = {
          code: aux
        } as UnityOfMeasure;
      */
      const observer = {
        next: (response) => {
          this.isLoadingResults = false;
          this.utilities.log('update response', response);
          /*aux = toUpload.itemType.code;
          toUpload.itemType = aux;
          aux = toUpload.uom.code;
          toUpload.uom = aux;*/
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
      this.utilities.log('data to upload', toUpload);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        this.itemService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.locationService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.orderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.itemTypeService.updateItemType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.uomsService.updateUom(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        this.customerService.updateCustomer(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.orderTypeService.updateorderType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.SECTIONS) {
        this.sectionService.updateSection(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }
    } else {
      this.dataProvider.returnData = toUpload;
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
      console.log('viewMode', this.viewMode);
      const keys = Object.keys(data.row).filter(key => key !== 'id');
      const keysForItem = keys.filter(key => key !== 'state');
      console.log('ngOnInit => row received', data.row);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        console.log('object is an item');
        this.row = data.row as Item;
        this.cardTitle = 'Item sku # ' + this.row.sku;
      } else if (this.type === IMPORTING_TYPES.LOCATIONS) {
        console.log('object is a location');
        this.row = data.row as Location;
        this.cardTitle = 'Location code # ' + this.row.code;
      } else if (this.type === IMPORTING_TYPES.ORDERS) {
        this.row = data.row as Order;
        this.cardTitle = 'Order # ' + this.row.orderNumber;
      } else if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        console.log('object is an item type');
        this.row = data.row as ItemType;
        this.cardTitle = 'Item Type ' + this.row.description;
      } else if (this.type === IMPORTING_TYPES.UOMS) {
        console.log('object is an uom');
        this.row = data.row as UnityOfMeasure;
        this.cardTitle = 'Unity of measure ' + this.row.description;
      } else if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        console.log('object is a customer');
        this.row = data.row as Customer;
        this.cardTitle = 'Customer ' + this.row.name;
      } else if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        console.log('object is an order type');
        this.row = data.row as OrderType;
        this.cardTitle = 'Order Type ' + this.row.description;
      } else if (this.type === IMPORTING_TYPES.SECTIONS) {
        console.log('object is a section');
        this.row = data.row as OrderType;
        this.cardTitle = 'Section ' + this.row.code;
      } else {
        this.cardTitle = 'Unknown object type';
        console.error('object is unknown');
      }
      this.remoteSync = true;
      this.init();
    });
  }
}
