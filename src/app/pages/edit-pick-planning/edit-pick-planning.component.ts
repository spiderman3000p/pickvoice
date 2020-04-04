import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { environment } from '../../../environments/environment';
import { PickPlanning, PickTask, PickTaskLine, Dock, Transport } from '@pickvoice/pickvoice-api';
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

interface PickPlanningData {
  pickTaskList: PickTask[];
  dockList: Dock[];
  transportList: Transport[];
}
@Component({
  selector: 'app-edit-pick-planning',
  templateUrl: './edit-pick-planning.component.html',
  styleUrls: ['./edit-pick-planning.component.scss']
})

export class EditPickPlanningComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.PICK_PLANNINGS;
  dataMap = ModelMap.PickPlanningMap;
  definitions = ModelMap.PickTaskMap;
  definitionsTransports = ModelMap.TransportMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  pickPlanningData: PickPlanningData;

  columnDefs: any[];
  columnDefsTransports: any[];
  dataSource: MatTableDataSource<PickTask>;
  dataSourceTransports: MatTableDataSource<Transport>;
  displayedDataColumns: string[];
  displayedDataColumnsTransports: string[];
  displayedHeadersColumns: any[];
  displayedHeadersColumnsTransports: any[];
  defaultColumnDefs: any[];
  defaultColumnDefsTransports: any[];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  pageSizeOptionsTransports = [5, 10, 15, 30, 50, 100];
  actionForSelected: FormControl;
  actionForSelectedTransports: FormControl;
  selection = new SelectionModel<PickTask>(true, []);
  selectionTransports = new SelectionModel<Transport>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) paginatorTransports: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSort, {static: true}) sortTransports: MatSort;
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService, private location: WebLocation,
    private activatedRoute: ActivatedRoute, private dataProviderService: DataProviderService,
    private router: Router, private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.dataSourceTransports = new MatTableDataSource([]);
    this.pickPlanningData = new Object() as PickPlanningData;
    this.pickPlanningData.pickTaskList = [];
    this.pickPlanningData.dockList = [];
    this.pickPlanningData.transportList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Pick Planning' : 'View Pick Planning';
    this.isLoadingResults = true;
  }

  init() {
    this.utilities.log('pick planning', this.row);
    this.getPickTaskList();
    this.getDockList();
    this.getTransportList();
    // inicializamos todo lo necesario para la tabla
    if (this.row) {
      this.dataSource.data = this.pickPlanningData.pickTaskList;
      // inicializar tabla mat-table
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla de pick task
    }
    if (this.row) {
      this.dataSourceTransports.data = this.pickPlanningData.transportList;
      // inicializar tabla mat-table
      this.utilities.log('dataSourceTransports.data', this.dataSourceTransports.data);
      this.displayedDataColumnsTransports = Object.keys(this.definitionsTransports);
      this.utilities.log('displayedDataColumnsTransports', this.displayedDataColumnsTransports);
      this.displayedHeadersColumnsTransports = ['select'].concat(Object.keys(this.definitionsTransports));
      this.displayedHeadersColumnsTransports.push('options');
      this.utilities.log('displayedHeadersColumnsTransports', this.displayedHeadersColumnsTransports);
      this.initColumnsDefsTransports(); // columnas a mostrarse en la tabla de transports
    }
    this.form = new FormGroup({
      targetDock: new FormControl(this.row.targetDock),
      description: new FormControl(this.row.description),
      state: new FormControl(this.row.state),
      progress: new FormControl(this.row.progress),
      processDate: new FormControl(this.row.processDate),
      rootWork: new FormControl(this.row.rootWork)
    });
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInPickPlanningPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInPickPlanningPage'));
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
  }

  initColumnsDefsTransports() {
    let shouldShow: boolean;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInPickPlanningPageT')) {
      this.columnDefsTransports = JSON.parse(localStorage.getItem('displayedColumnsInPickPlanningPageT'));
    } else {
      this.columnDefsTransports = this.displayedHeadersColumnsTransports.map((columnName, index) => {
        shouldShow = index === 0 || index === this.displayedHeadersColumnsTransports.length - 1 || index < 7;
        return {show: shouldShow, name: columnName};
      });
    }
    aux = this.columnDefsTransports.slice();
    aux.pop();
    aux.shift();
    this.defaultColumnDefsTransports = aux;
  }

  getDisplayedHeadersColumns() {
    return this.columnDefs.filter(col => col.show).map(col => col.name);
  }

  getDisplayedHeadersColumnsTransports() {
    return this.columnDefsTransports.filter(col => col.show).map(col => col.name);
  }

  getDefaultHeadersColumns() {
    return this.defaultColumnDefs;
  }

  getDefaultHeadersColumnsTransports() {
    return this.defaultColumnDefsTransports;
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
    localStorage.setItem('displayedColumnsInPickPlanningPage', JSON.stringify(this.columnDefs));
    // this.utilities.log('displayed column after', this.columnDefs);
  }

  toggleColumnTransports(column?) {
    this.utilities.log('displayed column until now', this.displayedDataColumnsTransports);

    const selectedCol = column ? this.columnDefsTransports.find(col => col.name === column.name) : null;
    const selectedDefaultCol = column ? this.defaultColumnDefsTransports.find(col => col.name === column.name) : null;
    if (selectedCol) {
      column.show = !column.show;
      selectedCol.show = !selectedCol.show;
      selectedDefaultCol.show = !selectedDefaultCol.show;
    } else {
      this.defaultColumnDefsTransports.forEach(col => col.show = true);
      this.columnDefsTransports.forEach(col => col.show = true);
    }
    // guardamos la eleccion en el local storage
    localStorage.setItem('displayedColumnsInPickPlanningPageT', JSON.stringify(this.columnDefsTransports));
    // this.utilities.log('displayed column after', this.columnDefs);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedTransports() {
    const numSelected = this.selectionTransports.selected.length;
    const numRows = this.dataSourceTransports.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  masterToggleTransports() {
    this.isAllSelectedTransports() ?
        this.selectionTransports.clear() :
        this.dataSourceTransports.data.forEach(row => this.selectionTransports.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  checkboxLabelTransports(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedTransports() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionTransports.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  actionForSelectedRows(action) {
    // this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selection.selected.length > 0) {
          this.deletePickTaskPrompt(this.selection.selected);
        } else {
          this.utilities.showSnackBar('You have no selected records', 'OK');
        }
        break;
      default: break;
    }
  }

  actionForSelectedRowsTransports(action) {
    // this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selectionTransports.selected.length > 0) {
          this.deleteTransportPrompt(this.selectionTransports.selected);
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

  deleteRowTransports(row: any) {
    if (this.selectionTransports.isSelected(row)) {
      this.selectionTransports.deselect(row);
    }
    const index = this.dataSourceTransports.data.findIndex(_row => _row === row);
    // this.utilities.log('index to delete', index);
    this.dataSourceTransports.data.splice(index, 1);
    this.refreshTableTransports();
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
        // TODO: tener servicio para eliminar registros de pick tasks
        this.deletePickTask(row);
      });
    } else {
      this.deletePickTask(rows);
    }
  }

  deleteRowsTransports(rows: any) {
    let deletedCounter = 0;
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRowTransports(rows);
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
        // TODO: tener servicio para eliminar registros de pick tasks
        this.deleteTransport(row);
      });
    } else {
      this.deleteTransport(rows);
    }
  }

  deletePickTask(row: any) {
    const index = this.pickPlanningData.pickTaskList.findIndex(_row => _row.id === row.id);
    if (index > 1) {
      this.pickPlanningData.pickTaskList.splice(index, 1);
    }
  }

  deleteTransport(row: any) {
    const index = this.pickPlanningData.transportList.findIndex(_row => _row.id === row.id);
    if (index > 1) {
      this.pickPlanningData.transportList.splice(index, 1);
    }
  }

  deletePickTaskPrompt(rows?: any) {
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

  deleteTransportPrompt(rows?: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRowsTransports(rows);
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

  editPickPlanningOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        viewMode: mode,
        type: IMPORTING_TYPES.PICK_TASKS,
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

  viewTransport(element: any) {
    this.utilities.log('row to send to view dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitionsTransports,
        viewMode: 'view',
        type: IMPORTING_TYPES.TRANSPORTS,
        remoteSync: false // para mandar los datos a la BD por la API
      }
    });
  }

  addPickTask() {
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.PICK_TASKS,
        title: 'Add New Pick task',
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
    this.utilities.exportToXlsx(dataToExport, 'Pick Planning ' + this.row.id);
  }

  exportPickTasks() {
    const dataToExport = this.dataSource.data.slice().map((row: any) => {
      delete row.id;
      delete row.index;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Pick Task List');
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

  private refreshTableTransports() {
    // If there's no data in filter we do update using pagination, next page or previous page
    if (this.dataSourceTransports.filter === '') {
      const aux = this.dataSourceTransports.filter;
      this.dataSourceTransports.filter = 'XXX';
      this.dataSourceTransports.filter = aux;
      // If there's something in filter, we reset it to 0 and then put back old value
    } else {
      const aux = this.dataSourceTransports.filter;
      this.dataSourceTransports.filter = '';
      this.dataSourceTransports.filter = aux;
    }
    this.dataSourceTransports.paginator = this.paginatorTransports;
    this.dataSourceTransports.sort = this.sortTransports;
  }

  getPickTaskList() {
    this.dataProviderService.getAllPickPlanningTasks(this.row.id).subscribe(results => {
      this.pickPlanningData.pickTaskList = results;
      this.dataSource.data = this.pickPlanningData.pickTaskList;
      this.refreshTable();
      this.utilities.log('pick task list', this.pickPlanningData.pickTaskList);
    });
  }

  getTransportList() {
    this.dataProviderService.getPickPlanningTransport(this.row.id).subscribe(result => {
      this.pickPlanningData.transportList = result;
      this.dataSourceTransports.data = result;
      this.utilities.log('pick planning transports', result);
    });
  }

  getDockList() {
    this.dataProviderService.getAllDocks().subscribe(results => {
      this.pickPlanningData.dockList = results;
      this.utilities.log('docks list', this.pickPlanningData.dockList);
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
      this.dataProviderService.updatePickPlanning(toUpload, this.row.id, 'response').pipe(retry(3))
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
        if (objectType === IMPORTING_TYPES.PICK_TASKS) {
          this.pickPlanningData.pickTaskList.push(result);
        }
        if (objectType === IMPORTING_TYPES.DOCKS) {
          this.pickPlanningData.dockList.push(result);
        }
        if (objectType === IMPORTING_TYPES.TRANSPORTS) {
          this.pickPlanningData.transportList.push(result);
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
        this.cardTitle = 'Pick Planning # ' + this.row.id;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
