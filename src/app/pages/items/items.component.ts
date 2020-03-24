import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { DataCacheService } from '../../services/data-cache.service';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { EditRowComponent } from '../../pages/edit-row/edit-row.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { ItemsService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, AfterViewInit {
  definitions: any = ModelMap.ItemMap;
  dataSource: MatTableDataSource<Item>;
  dataToSend: Item[];
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
  isLoadingResults = false;
  selection = new SelectionModel<any>(true, []);
  type = IMPORTING_TYPES.ITEMS;
  printableData: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dialog: MatDialog, private apiService: ItemsService, private router: Router,
    private utilities: UtilitiesService, private cacheService: DataCacheService) {
      this.dataSource = new MatTableDataSource([]);
      this.filter = new FormControl('');
      this.dataToSend = [];
      this.actionForSelected = new FormControl('');
      this.displayedDataColumns = Object.keys(ModelMap.ItemMap);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(ModelMap.ItemMap));
      this.displayedHeadersColumns.push('options');
      
      this.initColumnsDefs(); // columnas a mostrarse
      this.utilities.log('filters', this.filters);
      this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      });
      this.selection.changed.subscribe(selected => {
        this.utilities.log('new selection', selected);
      });

      this.utilities.log('displayed data columns', this.displayedDataColumns);
      this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
      this.loadData();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = ModelMap.ItemMap[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        this.utilities.log(`new formControl formControls[${column.name}]`, formControls[column.name]);
        this.utilities.log('formControls', formControls);
        filter.control = formControls[column.name];
        filter.formControl = ModelMap.ItemMap[column.name].formControl;
        this.filters.push(filter);
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('formControls', formControls);
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
        this.apiService.deleteItem(row.id, 'response', false).subscribe(observer);
      });
    } else {
      this.apiService.deleteItem(rows.id, 'response', false).subscribe(observer);
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

  loadData(useCache = true) {
    this.utilities.log('requesting items');
    this.isLoadingResults = true;
    this.cacheService.getCachedData(this.type, 'itemsList', useCache).subscribe(results => {
      this.isLoadingResults = false;
      this.utilities.log('items received', results);
      if (results && results.length > 0) {
        this.dataSource.data = results.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    });
  }

  reloadData() {
    this.selection.clear();
    this.loadData(false);
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

  applyFilters() {
  }
}
