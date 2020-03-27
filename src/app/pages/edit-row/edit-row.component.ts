import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, Customer, OrderLine, Section, OrderType,
         Transport } from '@pickvoice/pickvoice-api';
import { DataProviderService} from '../../services/data-provider.service';
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

@Component({
  selector: 'app-edit-row',
  templateUrl: './edit-row.component.html',
  styleUrls: ['./edit-row.component.scss']
})

export class EditRowComponent implements OnInit {
  definitions: any; // para mostrar datos de tablas
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
  selectsData: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute, private router: Router,
    private dialog: MatDialog, private dataProviderService: DataProviderService
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  init() {
    this.utilities.log('type', this.type);
    // this.remoteSync = data.remoteSync; // map of object
    this.dataMap = this.utilities.dataTypesModelMaps[this.type];
    this.utilities.log('remoteSync', this.remoteSync);
    this.utilities.log('dataMap', this.dataMap);
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    
    if (this.type === IMPORTING_TYPES.ORDERS) {
      this.utilities.log('order', this.row);
      this.definitions = ModelMap.OrderLineMap;
    }
    if (this.row && this.definitions && this.definitions.length > 0) { // si alguna tabla se va a mostrar
      // inicializamos todo lo necesario para la tabla
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla
    }
    this.selectsData = {};
    this.keys.forEach((key, index) => {
      if (this.row === undefined) {
        return;
      }
      // value = this.utilities.renderColumnData(this.dataMap[key].type, this.row[key]);
      if (this.dataMap[key].type !== 'table') {
        if (this.dataMap[key].required) {
          formControls[key] = new FormControl(this.row[key], Validators.required);
        } else {
          formControls[key] = new FormControl(this.row[key]);
        }
        if (this.dataMap[key].formControl.control === 'select') {
          this.selectsData[key] =
          this.dataProviderService.getDataFromApi(this.definitions[key].type);
          formControls[key].patchValue(-1);
        }
      }
      if (this.dataMap[key].type === 'table') {
        this.dataSource.data = this.row[key];
      }
    });
    this.form = new FormGroup(formControls);
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
    this.selectsData.orderLines = {};
    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = this.definitions[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        if (this.definitions[column.name].formControl.control === 'select') {
          this.selectsData.orderLines[column.name] =
          this.dataProviderService.getDataFromApi(this.definitions[column.name].type);
          formControls[column.name].patchValue(-1);
        }
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

  deleteRow(row: any, key) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    }
    this.deleteRowFromTable(row, key);
    this.refreshTable();
    return true;
  }

  deleteRows(rows: any, key: string) {
    let deletedCounter = 0;
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRow(rows, key);
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
        if (this.dataMap[key].type === IMPORTING_TYPES.ORDER_LINE) {
          this.deleteRowFromTable(rows, key);
          // this.orderLineService.delete(row).subscribe(observer);
        }
        // TODO: faltan los demas tipos de datos
      });
    } else {
      if (this.dataMap[key].type === IMPORTING_TYPES.ORDER_LINE) {
        this.deleteRowFromTable(rows, key);
        // this.orderLineService.delete(row).subscribe(observer);
      }
      // TODO: faltan los demas tipos de datos
    }
  }

  deleteRowFromTable(row: any, key: string) {
    const optionIndex = this.dataMap[key].formControl.valueIndex;
    const index = this.dataSource.data.findIndex(_row => _row[optionIndex] === row[optionIndex]);
    this.dataSource.data.splice(index, 1);
  }

  deletePrompt(rows?: any, key?: string) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRows(rows, key);
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

  editRowOnDialog(element: any, key: string,  mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        type: this.dataMap[key].type,
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

  addRow(key: string) {
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: this.dataMap[key].type,
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

  export() {
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

  addNewObject(key: string, objectType: string, myTitle: string) {
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
        this.selectsData[key] = this.dataProviderService.getDataFromApi(key);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
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
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    for (const key in toUpload) {
      if (formData[key]) {
        toUpload[key] = formData[key];
      }
    }
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
      this.utilities.log('data to upload', toUpload);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        this.dataProviderService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.dataProviderService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.dataProviderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.dataProviderService.updateItemType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.dataProviderService.updateUom(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        this.dataProviderService.updateCustomer(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.dataProviderService.updateOrderType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.SECTIONS) {
        this.dataProviderService.updateSection(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.TRANSPORTS) {
        this.dataProviderService.updateTransport(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }
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
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Item' : 'View Item';
      } else if (this.type === IMPORTING_TYPES.LOCATIONS) {
        console.log('object is a location');
        this.row = data.row as Location;
        this.cardTitle = 'Location code # ' + this.row.code;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Location' : 'View Location';
      } else if (this.type === IMPORTING_TYPES.ORDERS) {
        this.row = data.row as Order;
        this.cardTitle = 'Order # ' + this.row.orderNumber;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Order' : 'View Order';
      } else if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        console.log('object is an item type');
        this.row = data.row as ItemType;
        this.cardTitle = 'Item Type ' + this.row.description;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Item Type' : 'View Item Type';
      } else if (this.type === IMPORTING_TYPES.UOMS) {
        console.log('object is an uom');
        this.row = data.row as UnityOfMeasure;
        this.cardTitle = 'Unity of measure ' + this.row.description;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Unity Of Measure' : 'View Unity Of Measure';
      } else if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        console.log('object is a customer');
        this.row = data.row as Customer;
        this.cardTitle = 'Customer ' + this.row.name;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Customer' : 'View Customer';
      } else if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        console.log('object is an order type');
        this.row = data.row as OrderType;
        this.cardTitle = 'Order Type ' + this.row.description;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Order Type' : 'View Order Type';
      } else if (this.type === IMPORTING_TYPES.SECTIONS) {
        console.log('object is a section');
        this.row = data.row as OrderType;
        this.cardTitle = 'Section ' + this.row.code;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Section' : 'View Section';
      } else if (this.type === IMPORTING_TYPES.TRANSPORTS) {
        console.log('object is a transport');
        this.row = data.row as Transport;
        this.cardTitle = 'Transport #' + this.row.transportNumber;
        this.pageTitle = this.viewMode === 'edit' ? 'Edit Unknown' : 'View Unknown';
      } else {
        this.cardTitle = 'Unknown object type';
        console.error('object is unknown');
      }
      this.remoteSync = true;
      this.init();
    });
  }
}
