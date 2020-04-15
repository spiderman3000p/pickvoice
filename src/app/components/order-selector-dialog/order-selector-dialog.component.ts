import { ViewChild, Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelMap, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { OrderService, Order, OrderType, OrderLine } from '@pickvoice/pickvoice-api';
import { MyDataSource } from '../../models/my-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { takeLast, debounceTime, distinctUntilChanged, retry, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-selector-dialog',
  templateUrl: './order-selector-dialog.component.html',
  styleUrls: ['./order-selector-dialog.component.css']
})
export class OrderSelectorDialogComponent implements OnInit, AfterViewInit {
  title: string;
  message: string;
  definitions: any = ModelMap.OrderMap;
  dataSource: MyDataSource<Order>;
  dataToSend: Order[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];

  pageSizeOptions = [5, 10, 15, 30, 50, 100];

  filter: FormControl;
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
  type = IMPORTING_TYPES.ORDERS;
  selectsData: any;
  subscriptions: Subscription[] = [];
  parserFn: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<OrderSelectorDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.filter = new FormControl('');
    this.dataToSend = [];
    this.actionForSelected = new FormControl('');
    this.displayedDataColumns = Object.keys(this.definitions);
    this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));

    this.initColumnsDefs(); // columnas a mostrarse
    this.utilities.log('filters', this.filters);
    this.parserFn = (element: any, index) => {
      element.transport = element.transport ? element.transport.name : '';
      element.orderType = element.orderType ? element.orderType.name : '';
      element.customer = element.customer ? element.customer.name : '';
      return element;
    };
    this.utilities.log('displayed data columns', this.displayedDataColumns);
    this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
  }

  setSelectedElement() {
    this.dialogRef.close(this.selection.selected);
  }

  ngOnInit(): void {
    this.dataSource = new MyDataSource(this.dataProviderService);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
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
      if (this.filters[filterKey].controls.value.value !== undefined &&
          this.filters[filterKey].controls.value.value !== null &&
          this.filters[filterKey].controls.value.value !== '') {
        filtersToUse.push(this.filters[filterKey]);
      }
    }
    const stringParams = filtersToUse.length > 0 ? filtersToUse.map(filter =>
      `${filter.key}-filterType=${filter.type};${filter.key}-type=` +
      `${this.definitions[filter.key].formControl.control === 'select' ? 'number'
      : formValues[filter.key].type};${filter.key}-filter=${formValues[filter.key].value.toLowerCase()}`)
      .join(';') : '';
    this.utilities.log('filters to use: ', filtersToUse);
    this.utilities.log('filters string params: ', stringParams);
    return stringParams;
  }

  getPaginatorParams(): string {
    const startRow = this.paginator.pageIndex * this.paginator.pageSize;
    return `startRow=${startRow};endRow=${startRow + this.paginator.pageSize}`;
  }

  getSortParams(): string {
    return `sort-${this.sort.active}=${this.sort.direction}`;
  }

  loadDataPage() {
    this.paginatorParams = this.getPaginatorParams();
    this.sortParams = this.getSortParams();
    const paramsArray = Array.of(this.paginatorParams, this.filterParams, this.sortParams)
    .filter(paramArray => paramArray.length > 0);
    // this.utilities.log('paramsArray', paramsArray);
    const params = paramsArray.length > 0 ? paramsArray.join(';') : '';
    // this.utilities.log('loading data with params', params);
    this.dataSource.loadData(this.type, `${params}`)
    .subscribe((response: any) => {
        /*this.data = dataResults;
        this.dataCount = 100;
        this.dataSubject.next(dataResults);*/
        if (response.content) {
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
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInOrderSelectorPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInOrderSelectorPage'));
    } else {
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        return {show: true, name: columnName};
      });
    }
    aux = this.columnDefs.slice();
    aux.shift();
    this.defaultColumnDefs = aux;
    this.selectsData = [];
    this.columnDefs.slice().forEach((column, index) => {
      // ignoramos la columna 0
      if (index > 0) {
        filter = new Object();
        filter.show = column.show;
        this.utilities.log(`this.definitions[${column.name}]`, this.definitions[column.name]);
        filter.name = this.definitions[column.name].name;
        filter.type = this.definitions[column.name].formControl.type;
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
        filter.controls = formControls[column.name].controls;
        filter.controls.value.valueChanges.pipe(debounceTime(500), tap((value) => {
          this.utilities.log(`valor del campo ${column.name} cambiando a: `, value);
          this.applyFilters();
        }))
        .subscribe();
        filter.controls.type.valueChanges.pipe(debounceTime(500), tap((type) => {
          this.utilities.log(`tipo de filtro del campo ${column.name} cambiando a: `, type);
          // TODO: acomodar esto de modo que al cambiar tipo y haber un valor, hacer la busqueda
          if (false) {
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
    localStorage.setItem('displayedColumnsInOrderSelectorPage', JSON.stringify(this.columnDefs));
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

  renderColumnData(type: string, data: any) {
    const text = this.utilities.renderColumnData(type, data);
    return typeof text === 'string' ? text.slice(0, 30) : text;
  }
}
