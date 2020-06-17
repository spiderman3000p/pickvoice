import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { EditRowComponent } from '../../pages/edit-row/edit-row.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { ModelMap, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { OrderService, Order, OrderType, OrderLine } from '@pickvoice/pickvoice-api';
import { MyDataSource } from '../../models/my-data-source';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { take, takeLast, debounceTime, distinctUntilChanged, retry, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, Observable, merge, Observer, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  definitions: any = ModelMap.OrderListMap;
  dataSource: MyDataSource<Order>;
  dataToSend: Order[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];

  pageSizeOptions = [5, 10, 15, 30, 50, 100];

  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  filterParams = '';
  paginatorParams = '';
  sortParams = '';
  filteredDone = false;

  actionForSelected: FormControl;
  isLoadingResults = false;
  selection = new SelectionModel<any>(true, []);
  type = IMPORTING_TYPES.ORDERS_LIST;
  selectsData: any;
  subscriptions: Subscription[] = [];
  parserFn: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService) {
      this.dataToSend = [];
      this.actionForSelected = new FormControl('');
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');

      this.initColumnsDefs(); // columnas a mostrarse
      this.utilities.log('filters', this.filters);
      this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      });
      this.selection.changed.subscribe(selected => {
        this.utilities.log('new selection', selected);
      });
      this.parserFn = (element: any, index) => {
        element.transport = element.transport ? element.transport.name : '';
        element.orderType = element.orderType ? element.orderType.name : '';
        element.customer = element.customer ? element.customer.name : '';
        return element;
      };
      this.utilities.log('displayed data columns', this.displayedDataColumns);
      this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
  }

  ngOnInit() {
    this.dataSource = new MyDataSource(this.dataProviderService);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.loadDataPage();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(tap(() => this.loadDataPage()))
    .subscribe();
  }

  getFilterParams(): string {
    const formValues = this.filtersForm.value;
    this.utilities.log('filter form values: ', formValues);
    const filtersToUse = [];
    for (const filterKey in this.filters) {
      if ((this.filters[filterKey].controls.value.value !== undefined &&
         this.filters[filterKey].controls.value.value !== null &&
         this.filters[filterKey].controls.value.value !== '')) {
        filtersToUse.push(this.filters[filterKey]);
      }
    }
    let aux = '';
    const stringParams = filtersToUse.length > 0 ? filtersToUse.map(filter => {
      aux = `${filter.key}-filterType=${filter.type};${filter.key}-type=` +
      `${formValues[filter.key].type};`;

      if (filter.type === 'date' && formValues[filter.key].type === 'inRange') {
        aux += `${filter.key}-dateFrom=${formValues[filter.key].value};${filter.key}` +
        `-dateTo=${formValues[filter.key].valueTo}`;
      } else if (filter.type === 'number' && formValues[filter.key].type === 'inRange') {
        aux += `${filter.key}-filter=${formValues[filter.key].value};${filter.key}-filterTo=` +
        `${formValues[filter.key].valueTo}`;
      } else {
        aux += `${filter.key}-filter=${formValues[filter.key].value.toLowerCase()}`;
      }
      return aux;
    }).join(';') : '';
    this.utilities.log('filters to use: ', filtersToUse);
    this.utilities.log('filters string params: ', stringParams);
    return stringParams;
  }

  getPaginatorParams(): string {
    const startRow = this.paginator.pageIndex * this.paginator.pageSize;
    return `startRow=${startRow};endRow=${startRow + this.paginator.pageSize}`;
  }

  getSortParams(): string {
    if (this.sort !== undefined) {
      return `sort-${this.sort.active}=${this.sort.direction}`;
    }
    return `sort-orderNumber=asc`;
  }

  loadDataPage() {
    this.paginatorParams = this.getPaginatorParams();
    this.sortParams = this.getSortParams();
    const paramsArray = Array.of(this.paginatorParams, this.filterParams, this.sortParams)
    .filter(paramArray => paramArray.length > 0);
    // this.utilities.log('paramsArray', paramsArray);
    const params = paramsArray.length > 0 ? paramsArray.join(';') : '';
    // this.utilities.log('loading data with params', params);
    this.dataSource.loadData(IMPORTING_TYPES.ORDERS, `${params}`)
    .subscribe((response: any) => {
        /*this.data = dataResults;
        this.dataCount = 100;
        this.dataSubject.next(dataResults);*/
        if (response && response.content) {
            this.dataSource.lastRow = response.pageSize;
            this.dataSource.data = response.content.map(this.parserFn);
            this.dataSource.dataCount = response.totalElements;
            this.dataSource.dataSubject.next(this.dataSource.data);
        }
    }, error => {
      this.utilities.error('Error fetching data from server');
      this.utilities.showSnackBar('Error fetching data from server', 'OK');
    });
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInOrdersPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInOrdersPage'));
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
    this.selectsData = [];
    this.columnDefs.slice().forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1 && this.definitions[column.name] !== undefined) {
        filter = new Object();
        filter.show = column.show;
        this.utilities.log(`this.definitions[${column.name}]`, this.definitions[column.name]);
        filter.name = this.definitions[column.name].name;
        filter.type = this.definitions[column.name].formControl.control === 'textarea' ||
        this.definitions[column.name].formControl.control === 'input' ?
        this.definitions[column.name].formControl.type :
        (this.definitions[column.name].formControl.control === 'date' ? 'date' :
        (this.definitions[column.name].formControl.control === 'toggle' ? 'toggle' :
        (this.definitions[column.name].formControl.control === 'select' ?
        this.definitions[column.name].formControl.type : undefined)));
        filter.key = column.name;
        if (this.definitions[column.name].formControl.control !== 'select' &&
            this.definitions[column.name].formControl.control !== 'toggle') {
          filter.availableTypes = FILTER_TYPES.filter(_filterType => _filterType.availableForTypes
            .findIndex(availableType => filter.type === availableType
            || availableType === 'all') > -1);
        }
        formControls[column.name] = new FormGroup({
          type: new FormControl(FILTER_TYPES[0].value),
          value: new FormControl('')
        });
        if (this.definitions[column.name].formControl.type === 'number' ||
            this.definitions[column.name].formControl.type === 'date') {
          formControls[column.name].addControl('valueTo', new FormControl(''));
        }
        filter.controls = formControls[column.name].controls;
        filter.controls.value.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), tap((value) => {
          this.utilities.log(`valor del campo ${column.name} cambiando a: `, value);
          if (this.filters[column.name].controls.type.value === 'inRange') {
            if (this.filters[column.name].controls.valueTo &&
                this.filters[column.name].controls.valueTo.value.length > 0) {
              this.applyFilters();
            }
          } else {
            this.applyFilters();
          }
        })).subscribe();
        if (this.definitions[column.name].formControl.type === 'number' ||
          this.definitions[column.name].formControl.type === 'date') {
          filter.controls.valueTo.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), tap((value) => {
            this.utilities.log(`valor del campo ${column.name} cambiando a: `, value);
            if (this.filters[column.name].controls.type.value === 'inRange') {
              if (this.filters[column.name].controls.value &&
                this.filters[column.name].controls.value.value.length > 0) {
                this.applyFilters();
              }
            } else {
              this.applyFilters();
            }
          })).subscribe();
        }
        filter.controls.type.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), tap((type) => {
          this.utilities.log(`tipo de filtro del campo ${column.name} cambiando a: `, type);
          // TODO: acomodar esto de modo que al cambiar tipo y haber un valor, hacer la busqueda
          this.utilities.log('valor a buscar: ', this.filters[column.name].controls.value.value);
          if (this.filters[column.name].controls.value.value.length > 0) {
            this.applyFilters();
          }
        }))
        .subscribe();
        // formControls[column.name].get('type').patchValue(FILTER_TYPES[0].value);
        if (this.definitions[column.name].formControl.control === 'select') {
          this.dataProviderService.getDataFromApi(this.definitions[column.name].type).subscribe(results => {
            this.selectsData[column.name] = results;
            this.utilities.log('selectsData', this.selectsData);
          });
          // formControls[column.name].get('value').patchValue(-1);
         // this.utilities.log('selectsData: ', this.selectsData);
        }
        this.filters[column.name] = filter;
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('formControls', formControls);
    this.utilities.log('form values', this.filtersForm.value);
  }

  reloadData() {
    this.selection.clear();
    this.loadDataPage();
  }

  applyFilters(): void {
    this.filterParams = this.getFilterParams();
    this.filteredDone = this.filterParams.length > 0;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }

  isFilteredBy(column: string): boolean {
    return this.filterParams.includes(column);
  }

  clearFilterInColumn(column: string) {
    this.filters[column].controls.value.reset();
    this.filters[column].controls.type.patchValue(FILTER_TYPES[0].value);
    this.filteredDone = this.filterParams.length > 0;
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
    localStorage.setItem('displayedColumnsInOrdersPage', JSON.stringify(this.columnDefs));
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
    this.utilities.log('row o delete: ', row);
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    }
    const index = this.dataSource.data.findIndex((r: any) => r.orderId === row.orderId);
    if (index > -1) {
      this.utilities.log('index to delete', index);
      this.dataSource.data.splice(index, 1);
      this.refreshTable();
    } else {
      this.utilities.error('index not found', index);
    }
    return true;
  }

  deleteRows(rows: any) {
    let deletedCounter = 0;
    let errorsCounter = 0;
    let constraintErrors = false;
    const observables: Observable<any>[] = [];
    const allOperationsSubject = new Subject();
    this.dataSource.loadingSubject.next(true);
    allOperationsSubject.subscribe((operation: any) => {
      if (operation.type === 'success') {
        deletedCounter++;
      }
      if (operation.type === 'error') {
        errorsCounter++;
      }
      if (deletedCounter === (Array.isArray(rows) ? rows.length : 1)) {
        this.dataSource.loadingSubject.next(false);
        this.utilities.showSnackBar((Array.isArray(rows) ? 'Rows' : 'Row') + ' deleted successfully', 'OK');
      } else {
        if (deletedCounter === 0 && errorsCounter === (Array.isArray(rows) ? rows.length : 1)) {
          this.dataSource.loadingSubject.next(false);
          this.utilities.showSnackBar(constraintErrors ? 'Error on delete selected rows because there are' +
          ' in use' : 'Error on delete rows, check Internet conection', 'OK');
        } else if (deletedCounter > 0 && errorsCounter > 0 &&
                   deletedCounter + errorsCounter >= (Array.isArray(rows) ? rows.length : 1)) {
          if (constraintErrors) {
            this.dataSource.loadingSubject.next(false);
            this.utilities.showSnackBar('Some rows could not be deleted cause there are in use', 'OK');
          } else {
            this.dataSource.loadingSubject.next(false);
            this.utilities.showSnackBar('Some rows could not be deleted', 'OK');
          }
        }
      }
    }, error => null,
    () => {
    });
    const observer = {
      next: (result) => {
        this.utilities.log('Row deleted: ', result);
        if (result && result.rowToDelete) {
          this.deleteRow(result.rowToDelete);
          this.utilities.log('Row deleted');
          allOperationsSubject.next({type: 'success'});
        }
      },
      error: (error) => {
        this.utilities.error('Error on delete rows', error);
        if (error) {
          if (error.error.message.includes('constraint') ||
              (error.error.errors && error.error.errors[0].includes('foreign'))) {
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
        this.subscriptions.push(this.dataProviderService.deleteOrder(row.orderId, 'response', false).pipe(take(1))
        .pipe(tap(result => result.rowToDelete = row)).subscribe(observer));
        if (this.selection.isSelected(row)) {
          this.selection.deselect(row);
        }
      });
    } else {
      this.subscriptions.push(this.dataProviderService.deleteOrder(rows.orderId, 'response', false).pipe(take(1))
      .pipe(tap(result => result.rowToDelete = rows)).subscribe(observer));
      if (this.selection.isSelected(rows)) {
        this.selection.deselect(rows);
      }
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

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
    /*const dialogRef = this.dialog.open(EditRowComponent, {
      data: {
        row: element,
        map: this.utilities.dataTypesModelMaps.orders,
        type: IMPORTING_TYPES.ORDERS,
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });*/
    /*dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
            this.dataSource.data[element.index] = result;
            this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });*/
  }

  editRowOnDialog(element: any) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        type: IMPORTING_TYPES.ORDERS,
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

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.orders);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.orders,
        type: IMPORTING_TYPES.ORDERS,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Order'
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
      return row;
    });

    this.utilities.exportToXlsx(dataToExport, 'Orders List');
  }

  /*
    Esta funcion se encarga de refrescar la tabla cuando el contenido cambia.
    TODO: mejorar esta funcion usando this.dataSource y no el filtro
  */
  private refreshTable() {
    this.loadDataPage();
  }
}
