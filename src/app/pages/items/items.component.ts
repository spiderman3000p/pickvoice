import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { EditRowComponent } from '../../pages/edit-row/edit-row.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { ItemsService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';

import { MatCheckboxComponent } from './components/mat-checkbox.component';
/*import { MatInputComponent } from "./mat-input.component";
import { MatRadioComponent } from "./mat-radio.component";
import { MatSelectComponent } from "./mat-select.component";*/

import { AllCommunityModules, GridOptions } from '@ag-grid-community/all-modules';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, AfterViewInit, OnDestroy {
  definitions: any = ModelMap.ItemMap;
  dataSource: MatTableDataSource<Item>;
  dataToSend: Item[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  itemTypeList = [];
  unityOfMeasureList = [];
  itemStateList = [];
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  isLoadingResults = false;
  selection = new SelectionModel<any>(true, []);
  type = IMPORTING_TYPES.ITEMS;
  printableData: any;
  selectsData: any[];
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
      // this.dataSource = new MatTableDataSource([]);
      // this.filter = new FormControl('');
      this.dataToSend = [];
      this.actionForSelected = new FormControl('');
      this.displayedDataColumns = Object.keys(this.definitions);
      // +this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      // this.displayedHeadersColumns.push('options');
      // this.initColumnsDefs(); // columnas a mostrarse
      // this.utilities.log('filters', this.filters);
      this.subscriptions.push(this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      }));
      this.agGridColumnDefs = this.displayedDataColumns.map(column => {
        return {
          field: column,
          filter: true,
          editable: true,
          sortable: true
        };
      });
      this.utilities.log('agGridColumnDefs', this.agGridColumnDefs);
      this.utilities.log('displayed data columns', this.displayedDataColumns);
      // this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
      // this.loadData();
  }

  ngOnInit() {
    this.initAgGrid();
    /*this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
  }

  ngAfterViewInit() {
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInItemsPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInItemsPage'));
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
    // this.utilities.log('formControls', formControls);
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
    localStorage.setItem('displayedColumnsInItemsPage', JSON.stringify(this.columnDefs));
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
        this.subscriptions.push(this.dataProviderService.deleteItem(row.id, 'response', false)
        .subscribe(observer));
      });
    } else {
      this.subscriptions.push(this.dataProviderService.deleteItem(rows.id, 'response', false)
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

  resetFilters() {
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
        this.utilities.log('--------------------------------------------');*/
        return value !== undefined && value !== null && value.toString().toLowerCase().includes(value2.toLowerCase());
      });
    };
    this.dataSource.filter = 'filtred';
  }

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
        type: IMPORTING_TYPES.ITEMS,
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
            rowData = results.map(result => this.utilities.objectToRow(result, this.type));
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

  loadData(useCache = true) {
    this.utilities.log('requesting items');
    this.isLoadingResults = true;
    this.subscriptions.push(this.dataProviderService.getAllItems().subscribe(results => {
      this.isLoadingResults = false;
      this.utilities.log('items received', results);
      this.agGridRowData = results.map(item => this.utilities.objectToRow(item, this.type));
      this.initAgGrid();
      /*if (results && results.length > 0) {
        this.dataSource.data = results.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();
      }*/
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.selection.clear();
    // this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.items);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.items,
        type: IMPORTING_TYPES.ITEMS,
        remoteSync: true // para mandar los datos a la BD por la API
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

  export() {
    const dataToExport = this.dataSource.data.map((row: any) => {
      return this.utilities.getJsonFromObject(row, this.type);
    });
    this.utilities.exportToXlsx(dataToExport, 'Items List');
  }

  printRow(data: any) {
    this.printableData = data;
    setTimeout(() => {
      if (this.utilities.print('printSection')) {
        this.printableData = null;
      }
    }, 1000);
  }

  printRows() {
    this.printableData = this.selection.selected;
    setTimeout(() => {
      if (this.utilities.print('printSection')) {
        this.printableData = null;
      }
    }, 1000);
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
