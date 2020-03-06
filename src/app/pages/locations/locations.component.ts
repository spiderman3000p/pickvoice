import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { LocationsService, Location } from '@pickvoice/pickvoice-api';
import { Observable, Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Observer } from 'rxjs';

export interface ValidationError {
  error: string;
  index: number;
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  definitions: any = ModelMap.LocationMap;
  dataSource: MatTableDataSource<Location>;
  dataToSend: Location[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  actionForSelected: FormControl;
  isLoadingResults = false;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dialog: MatDialog, private apiService: LocationsService,
    private utilities: UtilitiesService) {
      this.dataSource = new MatTableDataSource([]);
      this.filter = new FormControl('');
      this.actionForSelected = new FormControl('');
      this.dataToSend = [];
      this.displayedDataColumns = Object.keys(ModelMap.LocationMap);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(ModelMap.LocationMap));
      this.displayedHeadersColumns.push('options');
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        return {show: true, name: columnName};
      });
      this.defaultColumnDefs = this.displayedDataColumns.map((columnName, index) => {
        return {show: true, name: columnName};
      });
      this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      });
      this.utilities.log('displayed data columns', this.displayedDataColumns);
      this.utilities.log('displayed headers columns', this.getDisplayedHeadersColumns());
      this.loadData();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    if (selectedCol) {
      column.show = !column.show;
      selectedCol.show = !selectedCol.show;
    } else {
      this.defaultColumnDefs.forEach(col => col.show = true);
      this.columnDefs.forEach(col => col.show = true);
    }
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
    const index = this.dataSource.data.findIndex(_row => _row === row);
    return this.dataSource.data.splice(index, 1);
  }

  deleteRows(rows: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRow(rows);
        }
      },
      error: (error) => {
        this.utilities.error('Error on delete rows', error);
        this.utilities.showSnackBar('Error on delete rows', 'OK');
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        this.apiService.deleteLocation(row.id, 'response', false).subscribe(observer);
      });
    } else {
      this.apiService.deleteLocation(rows.id, 'response', false).subscribe(observer);
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

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  renderColumnData(type: string, data: any) {
    return this.utilities.renderColumnData(type, data);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadData() {
    this.isLoadingResults = true;
    this.utilities.log('requesting locations');
    this.apiService.retrieveAllLocation('response', false).pipe(retry(3)/*, catchError(this.handleError)*/)
    .subscribe(response => {
      this.isLoadingResults = false;
      this.utilities.log('locations received', response.body);
      this.dataSource.data = response.body.map((element, i) => {
        return { index: i, ... element};
      });
      this.refreshTable();
    }, error => {
      this.utilities.error('Error on requesting locations');
      this.isLoadingResults = false;
      this.utilities.showSnackBar('Error requesting data', 'OK');
    });
  }

  reloadData() {
    this.loadData();
  }

  addRow() {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.locations,
        type: IMPORTING_TYPES.LOCATIONS,
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

  editRow(element) {
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        data:
        {
          row: element,
          map: ModelMap.LocationMap,
          type: IMPORTING_TYPES.LOCATIONS,
          remoteSync: true // para mandar los datos a la BD por la API
        }
      }
    );
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
}
