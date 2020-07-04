import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';
import { DataProviderService } from '../../services/data-provider.service';
import { environment } from '../../../environments/environment';
import { Customer } from '@pickvoice/pickvoice-api/model/customer';
import { Store } from '@pickvoice/pickvoice-api/model/store';
import { PrintComponent } from '../../components/print/print.component';
import { RowOptionComponent } from './row-option.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { SharedDataService } from '../../services/shared-data.service';
import { Subject, merge, Subscription, from, Observable, Observer } from 'rxjs';
import { take, takeLast, retry, switchMap } from 'rxjs/operators';
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
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})

export class EditCustomerComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.CUSTOMERS;
  dataMap = ModelMap.CustomerMap;
  remoteSync: boolean;
  keys: string[];
  row: Customer;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  /* para tabla ag-grid */
  gridApi;
  gridColumnApi;
  storesColDefs: any[] = [
    {
      headerName: 'CODE',
      field: 'code',
      width: 100,
      editable: true
    },
    {
      headerName: 'NAME',
      field: 'name',
      width: 100,
      editable: true
    },
    {
      headerName: 'PHONE 1',
      field: 'phone1',
      width: 100,
      editable: true
    },
    {
      headerName: 'PHONE 2',
      field: 'phone2',
      width: 100,
      editable: true
    },
    {
      headerName: 'EMAIL',
      field: 'email',
      width: 100,
      editable: true
    },
    {
      headerName: 'EAN13',
      field: 'ean13',
      width: 100,
      editable: true
    },
    {
      headerName: 'CONTACT',
      field: 'contact',
      width: 100,
      editable: true
    },
    {
      headerName: 'OPTIONS',
      field: 'options',
      cellRenderer: 'rowOption',
      cellRendererParams: {
        deleteStore: this.deletePrompt.bind(this),
        startEditStore: this.startEditStore.bind(this),
        finishEditStore: this.finishEditStore.bind(this),
      }
    }
  ];
  storesData: any;
  /* para tabla de stores */
  frameworkComponents: any;
  definitions: any = ModelMap.StoresMap;
  dataSource: MatTableDataSource<Store>;
  dataToSend: Store[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  selection = new SelectionModel<any>(true, []);
  selectsData: any;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService
  ) {
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Customer' : 'View Customer';
    this.isLoadingResults = true;
    this.form = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      contact: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      longitude: new FormControl(''),
      latitude: new FormControl(''),
      zone: new FormControl(''),
      neighborhood: new FormControl(''),
      gln: new FormControl('')
    });
    /* para tabla ag-grid */
    this.displayedDataColumns = Object.keys(this.definitions);
    this.frameworkComponents = {
      rowOption: RowOptionComponent
    };
  }

  init() {
    this.utilities.log('customer', this.row);
    this.form = new FormGroup({
      code: new FormControl(this.row.code),
      name: new FormControl(this.row.name),
      contact: new FormControl(this.row.contact),
      phone: new FormControl(this.row.phone),
      address: new FormControl(this.row.address),
      postalCode: new FormControl(this.row.postalCode),
      longitude: new FormControl(this.row.longitude),
      latitude: new FormControl(this.row.latitude),
      zone: new FormControl(this.row.zone),
      neighborhood: new FormControl(this.row.neighborhood),
      gln: new FormControl(this.row.gln)
    });
    // this.loadData();
    this.storesData = this.dataProviderService.getAllCustomerStores(this.row.id);
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.ownerId;
    delete dataToExport.cityId;
    this.utilities.exportToXlsx(dataToExport, 'Customer # ' + this.row.code);
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
      this.dataProviderService.updateCustomer(toUpload, this.row.id, 'response').pipe(retry(3))
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

  /* Metodos para la tabla de stores */
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
    localStorage.setItem('displayedColumnsInEditCustomerPage', JSON.stringify(this.columnDefs));
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
    let errorsCounter = 0;
    let constraintErrors = false;
    const observables: Observable<any>[] = [];
    const allOperationsSubject = new Subject();
    allOperationsSubject.subscribe((operation: any) => {
      if (operation.type === 'success') {
        deletedCounter++;
      }
      if (operation.type === 'error') {
        errorsCounter++;
      }
      if (deletedCounter === (Array.isArray(rows) ? rows.length : 1)) {
        this.utilities.showSnackBar((Array.isArray(rows) ? 'Rows' : 'Row') + ' deleted successfully 1', 'OK');
      } else {
        if (deletedCounter === 0 && errorsCounter === (Array.isArray(rows) ? rows.length : 1)) {
          this.utilities.showSnackBar(constraintErrors ? 'Error on delete selected rows because there are' +
          ' in use' : 'Error on delete rows, check Internet conection', 'OK');
        } else if (deletedCounter > 0 && errorsCounter > 0 &&
                   deletedCounter + errorsCounter >= (Array.isArray(rows) ? rows.length : 1)) {
          this.utilities.showSnackBar('Some rows could not be deleted', 'OK');
        }
      }
    }, error => null,
    () => {
    });
    const observer = {
      next: (result) => {
        this.utilities.log('Row deleted: ', result);
        if (result) {
          this.deleteRow(rows);
          this.utilities.log('Row deleted');
          allOperationsSubject.next({type: 'success'});
        }
      },
      error: (error) => {
        this.utilities.error('Error on delete rows', error);
        if (error) {
          if (error.error.message.includes('constraint')) {
            constraintErrors = true;
          }
          allOperationsSubject.next({type: 'error'});
        }
      },
      complete: () => {
        // allOperationsSubject.complete();
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        this.subscriptions.push(this.dataProviderService.deleteStore(row.id, 'response', false).pipe(take(1))
        .subscribe(observer));
      });
    } else {
      this.subscriptions.push(this.dataProviderService.deleteStore(rows.id, 'response', false).pipe(take(1))
      .subscribe(observer));
    }
  }

  deletePrompt(params: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteStore(params);
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
    this.dataSource.filterPredicate = (data: Store, filter: string) => {
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
        type: IMPORTING_TYPES.STORES,
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
    this.utilities.log('requesting stores');
    this.isLoadingResults = true;
    this.subscriptions.push(this.dataProviderService.getAllCustomerStores(this.row.id)
    .subscribe(results => {
      this.isLoadingResults = false;
      this.utilities.log('stores received', results);
      if (results && results.length > 0) {
        /*this.dataSource.data = results.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();*/
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.selection.clear();
    this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.stores);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.STORES,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Store',
        defaultValues: {
          customerId: this.row.id,
          cityId: this.authService.getCityId()
        }
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.storesData = this.dataProviderService.getAllCustomerStores(this.row.id);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  exportTableData() {
    let dataToExport;
    this.dataProviderService.getAllCustomerStores(this.row.id).subscribe(data => {
      if (data && data.length > 0) {
        dataToExport = data.map((row: any) => {
          /*delete row.uomId;
          delete row.itemId;*/
          return this.utilities.getJsonFromObject(row, IMPORTING_TYPES.STORES);
        });
        this.utilities.exportToXlsx(dataToExport, 'Stores List');
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  updateStore(event) {
    console.log(event);
    const store = event.data;
    console.log('updateStore', store);
    this.dataProviderService.updateStore(store, store.id).subscribe(result => {
      this.utilities.log('store update result', result);
      if (result) {
        this.utilities.showSnackBar('Store updated successfully', 'OK');
      }
    }, error => {
      this.utilities.error('Error on update store', error);
      this.utilities.showSnackBar('Error on update store', 'OK');
    });
  }

  deleteStore(params: any) {
    this.utilities.log('edit-customer. deleteStore params', params);
    this.dataProviderService.deleteStore(params.rowData.id).subscribe(results => {
      this.utilities.log('delete store results', results);
      if (results) {
        this.utilities.showSnackBar('Store deleted successfully', 'OK');
        this.storesData = this.dataProviderService.getAllCustomerStores(this.row.id);
      }
    }, error => {
      this.utilities.error('Error on delete store', error);
      this.utilities.showSnackBar('Error on delete store', 'OK');
    });
  }

  startEditStore(params: any, rIndex: number, cKey: string) {
    this.utilities.log('startEditStore params', params);
    this.utilities.log('startEditStore rowIndex', rIndex);
    this.utilities.log('startEditStore colKey', cKey);
    this.gridApi.startEditingCell({rowIndex: rIndex, colKey: 'code'});
  }

  finishEditStore(params: any) {
    this.utilities.log('edit-customer. finishEditStore params', params);
    this.gridApi.stopEditing();
  }

  checkKeyPressed(event: KeyboardEvent) {
    console.log('event', event);
    if (event.key && event.key === 'Enter') {
      event.stopPropagation();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // new EventListener(this.gridApi.onRow)
  }
  rowOption(params) {
    // console.log('rowOptions', params);
    // this.utilities.log('sdsd');
  }
  /* fin de metodos para la tabla de stores */
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
        this.cardTitle = 'Customer # ' + this.row.code;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
