import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { EditRowComponent } from '../../pages/edit-row/edit-row.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { InventoryItem } from '../../models/inventory-item.model';
import { ModelMap, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { MyDataSource } from '../../models/my-data-source';

import { AllCommunityModules, GridOptions } from '@ag-grid-community/all-modules';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { timeout, debounceTime, distinctUntilChanged, retry, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, Subscription, Observable, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, AfterViewInit, OnDestroy {
  definitions: any = ModelMap.InventoryItemMap;
  dataSource: MyDataSource<InventoryItem>;
  dataToSend: InventoryItem[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];

  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any = {};
  filterParams = '';
  paginatorParams = '';
  sortParams = '';
  filteredDone = false;
  actionForSelected: FormControl;
  isLoadingResults = false;
  selection = new SelectionModel<any>(true, []);
  type = IMPORTING_TYPES.INVENTORY;
  selectsData: any[] = [];
  subscriptions: Subscription[] = [];
  agGridOptions: GridOptions;
  agGridModules = AllCommunityModules;
  agGridRowData = [];
  agGridColumnDefs = [];
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
      this.subscriptions.push(this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      }));
      this.utilities.log('displayed data columns', this.displayedDataColumns);
      this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
  }

  ngOnInit() {
    // this.initAgGrid();
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
        if (response && response.content) {
            this.dataSource.lastRow = response.pageSize;
            this.dataSource.data = response.content;
            this.dataSource.dataCount = response.totalElements;
            this.dataSource.dataSubject.next(this.dataSource.data);
        }
        /*if (response) {
          // this.dataSource.lastRow = response.length;
          this.dataSource.data = response;
          this.dataSource.dataCount = response.totalElements;
          this.dataSource.dataSubject.next(this.dataSource.data);
        }*/
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
    if (localStorage.getItem('displayedColumnsInInventoryPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInInventoryPage'));
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
      if (index > 0 && index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = this.definitions[column.name].name;
        filter.type = this.definitions[column.name].formControl.control === 'input' ?
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
          this.utilities.log('selectsData: ', this.selectsData);
        }
        this.filters[column.name] = filter;
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('this.filters', this.filters);
    this.utilities.log('formControls', formControls);
    this.utilities.log('form values', this.filtersForm.value);
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

  getPrintableColumns() {
    const headersColumns = this.getDisplayedHeadersColumns();
    headersColumns.shift();
    headersColumns.pop();
    return headersColumns;
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
    localStorage.setItem('displayedColumnsInInventoryPage', JSON.stringify(this.columnDefs));
    this.utilities.log('displayed column after', this.columnDefs);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection && this.selection.selected ? this.selection.selected.length : 0;
    const numRows = this.dataSource && this.dataSource.data ? this.dataSource.data.length : 0;
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
    const index = this.dataSource.data.findIndex(_row => _row.itemId === row.itemId);
    this.utilities.log('index to delete', index);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.refreshTable();
    } else {
      this.utilities.error('index not found', index);
    }
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
        this.subscriptions.push(this.dataProviderService.deleteInventoryItem(row.id, 'response', false)
        .subscribe(observer));
      });
    } else {
      this.subscriptions.push(this.dataProviderService.deleteInventoryItem(rows.id, 'response', false)
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

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  renderColumnData(type: string, data: any) {
    const text = this.utilities.renderColumnData(type, data);
    return typeof text === 'string' ? text.slice(0, 30) : text;
  }

  applyFilters(): void {
    this.filterParams = this.getFilterParams();
    this.filteredDone = this.filterParams.length > 0;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }

  resetFilters() {
    this.filterParams = '';
    this.loadDataPage();
  }
  /*
  applyFilters() {
    const formValues = this.filtersForm.value;
    let value;
    let value2;
    // this.utilities.log('filter form values: ', formValues);
    const filters = this.filters.filter(filter => filter.show &&
                    formValues[filter.key] && formValues[filter.key].length > 0);
    // this.utilities.log('filters: ', filters);
    this.dataSource.filterPredicate = (data: Item, filter: string) => {
      // this.utilities.log('data', data);
      return filters.every(shownFilter => {
        value = this.utilities.getSelectIndexValue(this.definitions, data[shownFilter.key], shownFilter.key);
        value2 = formValues[shownFilter.key].toString();
        /*
        this.utilities.log('data[shownFilter.key]', data[shownFilter.key]);
        this.utilities.log('shownFilter.key', shownFilter.key);
        this.utilities.log('value', value);
        this.utilities.log('value2', value2);
        this.utilities.log('--------------------------------------------');*
        return value !== undefined && value !== null && value.toString().toLowerCase().includes(value2.toLowerCase());
      });
    };
    this.dataSource.filter = 'filtred';
  }*/

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
    /*const dialogRef = this.dialog.open(EditRowComponent, {
      data: {
        row: element,
        map: this.utilities.dataTypesModelMaps.items,
        type: IMPORTING_TYPES.ITEMS,
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
        type: IMPORTING_TYPES.INVENTORY,
        remoteSync: true // para mandar los datos a la BD por la API
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

  initAgGrid() {
    this.agGridOptions = {
      columnDefs: this.columnDefs,
      enableColResize : true,
      enableSorting : true,
      enableFilter : true,
      rowSelection: 'single',
      enableServerSideSorting : true,
      enableServerSideFilter : true,
      rowModelType : 'infinite',
      pagination: true,
      paginationPageSize : 100,
      cacheOverflowSize : 2,
      maxConcurrentDatasourceRequests : 2,
      infiniteInitialRowCount : 1,
      maxBlocksInCache : 2,
      onGridReady: () => {
        // this.agGridOptions.api.sizeColumnsToFit();
        this.agGridOptions.api.showLoadingOverlay();
      },
      frameworkComponents: {
        // checkboxRenderer: MatCheckboxComponent
      },
      datasource : {
        getRows : (params) => {
          const filterModel = params.filterModel;
          let param = '';
          this.utilities.log('filterModel', filterModel);
          for (const p in filterModel) {
            if (1) {
              for (const q in filterModel[p]) {
                if (1) {
                  const x = p + '-' + q + '=' + filterModel[p][q];
                  param += x + ';';
                }
              }
            }
          }
          const sortModel = params.sortModel;
          if (sortModel && sortModel.length > 0) {
            sortModel.forEach(sortElem => {
              param += 'sort-' + sortElem.colId + '=' + sortElem.sort + ';';
            });
          }
          param += 'startRow=' + params.startRow + ';' + 'endRow=' + params.endRow + ';';
          let rowData;
          this.dataProviderService.getDataFromApi(this.type, param).subscribe(results => {
            rowData = results.map(result => this.utilities.getJsonFromObject(result, this.type));
            let lastRow = -1;
            if (rowData.length < (params.endRow - params.startRow)) {
              lastRow = params.startRow + rowData.length;
            }
            this.agGridOptions.api.sizeColumnsToFit();
            this.agGridOptions.api.hideOverlay();
            params.successCallback(rowData, lastRow);
          });
        }
      }
    } as GridOptions;
  }

  reloadData() {
    this.selection.clear();
    this.loadDataPage();
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.inventory);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.inventory,
        type: IMPORTING_TYPES.INVENTORY,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Inventory Item'
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.dataSource.data.push(result);
        this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  export(limit?: number) {
    let dataToExport;
    if (limit === undefined) {
      this.dataProviderService.getAllInventoryItems().subscribe((results: any) => {
        if (results && results.content) {
          dataToExport = results.content.map((row: any) => {
            return this.utilities.getJsonFromObject(row, this.type);
          });
          this.utilities.exportToXlsx(dataToExport, 'Inventory All Items List');
        }
        this.utilities.showSnackBar('Nothing to Export', 'OK');
      });
    } else {
      dataToExport = this.dataSource.data.slice(0, limit).map((row: any) => {
        return this.utilities.getJsonFromObject(row, this.type);
      });
      this.utilities.exportToXlsx(dataToExport, `Inventory Items List (${limit})`);
    }
  }
  /*
    Esta funcion se encarga de refrescar la tabla cuando el contenido cambia.
    TODO: mejorar esta funcion usando this.dataSource y no el filtro
  */
  private refreshTable() {
    this.loadDataPage();
    // If there's no data in filter we do update using pagination, next page or previous page
    /*if (this.dataSource.filter === '') {
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
    this.dataSource.sort = this.sort;*/
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
