import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { PickTask, Dock, Transport } from '@pickvoice/pickvoice-api';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { UserSelectorDialogComponent } from '../../components/user-selector-dialog/user-selector-dialog.component';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { SharedDataService } from '../../services/shared-data.service';
import { Observer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES, STATES } from '../../models/model-maps.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from '@pickvoice/pickvoice-api/model/user';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { SearchTransportDialogComponent } from 'src/app/components/transport-selector-dialog/transport-selector-dialog.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface PickPlanningData {
  pickTaskList: PickTask[];
  dockList: Dock[];
  transportList: Transport[];
  pickPlanningStates: string[];
}
@Component({
  selector: 'app-edit-pick-planning',
  templateUrl: './edit-pick-planning.component.html',
  styleUrls: ['./edit-pick-planning.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class EditPickPlanningComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.PICK_PLANNINGS;
  dataMap = ModelMap.PickPlanningMap;
  // definitions = ModelMap.PickTaskMap;
  definitions = ModelMap.PickTaskMapCustom;
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
  expandedElement: any | null;
  states = STATES;
  @ViewChild(MatPaginator, {static: true}) paginatorTasks: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) paginatorTransports: MatPaginator;
  @ViewChild(MatSort, {static: true}) sortTasks: MatSort;
  @ViewChild(MatSort, {static: true}) sortTransports: MatSort;
  @ViewChild(MatSort) set matSortTasks(ms: MatSort) {
    this.sortTasks = ms;
    this.setTasksDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginatorTasks(mp: MatPaginator) {
    this.paginatorTasks = mp;
    this.setTasksDataSourceAttributes();
  }
  @ViewChild(MatSort) set matSortTransports(ms: MatSort) {
    this.sortTransports = ms;
    this.setTransportDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginatorTransports(mp: MatPaginator) {
    this.paginatorTransports = mp;
    this.setTransportDataSourceAttributes();
  }
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
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

  setTasksDataSourceAttributes() {
    this.dataSource.paginator = this.paginatorTasks;
    this.dataSource.sort = this.sortTasks;
  }

  setTransportDataSourceAttributes() {
    this.dataSourceTransports.paginator = this.paginatorTransports;
    this.dataSourceTransports.sort = this.sortTransports;
  }

  executeContext(action: string, element: any) {
    let newState;
    let selectedTasks = [];
    if (this.selection.selected.length > 0) {
      this.utilities.log('selected tasks:', this.selection.selected);
      selectedTasks = this.selection.selected;
    } else if (element !== undefined && element !== null) {
      selectedTasks.push(element);
    }
    switch (action) {
      case 'activateTask': {
        /*
          Estado de la tarea
          PE - Pending,
          WP - Work In Progress,
          PS - Paused,
          CP - Complete,
          CA - Canceled)
        */
        newState = PickTask.TaskStateEnum.AC;
        this.changeTaskState(selectedTasks, newState);
        break;
      }
      case 'cancelTask': {
        /*
          Estado de la tarea
          PE - Pending,
          WP - Work In Progress,
          PS - Paused,
          CP - Complete,
          CA - Canceled)
        */
        newState = PickTask.TaskStateEnum.CA;
        this.changeTaskState(selectedTasks, newState);
        break;
      }
      case 'closeTask': {
        /*
          Estado de la tarea
          PE - Pending,
          WP - Work In Progress,
          PS - Paused,
          CP - Complete,
          CA - Canceled)
        */
        newState = PickTask.TaskStateEnum.CP;
        this.changeTaskState(selectedTasks, newState);
        break;
      }
      case 'assignToUser': {
        const dialogRef = this.dialog.open(UserSelectorDialogComponent, {
          data: {
            collection: this.dataProviderService.getAllUsers(),
            title: 'Select User',
            message: 'Please select a user from the list'
          }
        });
        dialogRef.afterClosed().subscribe((selectedUser: User) => {
          this.utilities.log('user selector dialog result:', selectedUser);
          if (selectedUser === null) {
            return;
          }
          if (selectedUser && selectedTasks.length > 0) {
            this.assignUserToTaskList(selectedTasks.map(task => task.id), selectedUser);
          } else {
            this.utilities.error('Selected user is invalid or none selected tasks');
            this.utilities.showSnackBar('Selected user is invalid or none selected tasks', 'OK');
          }
        }, error => {
          this.utilities.error('error after closing user selector dialog');
          this.utilities.showSnackBar('Error after closing user selector dialog', 'OK');
          this.isLoadingResults = false;
        });
        break;
      }
      case 'incrementPriority': {
        /*
          10 max
        */
        if (element && element.priority < 10) {
          const elementCopy = Object.assign({}, element);
          elementCopy.priority++;
          this.updatePickTask(elementCopy, element);
        } else {
          this.utilities.error('task already have priority 10');
          this.utilities.showSnackBar('Task allready have maximum priority', 'OK');
        }
        break;
      }
      case 'decrementPriority': {
        /*
          0 min
        */
        if (element && element.priority > 0) {
          const elementCopy = Object.assign({}, element);
          elementCopy.priority--;
          this.updatePickTask(elementCopy, element);
        } else {
          this.utilities.error('task already have priority 0');
          this.utilities.showSnackBar('Task allready have minimum priority', 'OK');
        }
        break;
      }
      case 'viewBySku': {
        this.generateTaskPdf(element, action);
        break;
      }
      case 'viewByLine': {
        this.generateTaskPdf(element, action);
        break;
      }
    }
  }

  assignUserToTaskList(tasks: any[], user: User) {
    this.dataProviderService.assignUserToPickTaskList(tasks, user)
    .subscribe(response => {
      this.utilities.log('assign user to task list response', response);
      if (response) {
        /*tasks.forEach(task => {
          task.user = user;
        });*/
        this.utilities.log('user assign response', response);
        this.utilities.showSnackBar('User assigned successfully', 'OK');
      }
    }, error => {
      this.utilities.error('user assign error', error);
      if (error.status === 500 && error.error && error.error.message) {
        this.utilities.showSnackBar(`Error: ${error.error.message}`, 'OK');
      } else {
        this.utilities.showSnackBar('User could not be assigned', 'OK');
      }
    });
  }

  updatePickTask(newTask: any, oldTask: any) {
    console.log('updating pick task')
    console.log('old task', oldTask)
    console.log('new task', newTask)
    this.dataProviderService.updatePickTask(newTask, oldTask.id).subscribe(response => {
      if (response) {
        oldTask.priority = newTask.priority;
        this.utilities.log('task update response', response);
        this.utilities.showSnackBar('Task updated successfully', 'OK');
      }
    }, error => {
      this.utilities.error('task update error', error);
      if (error.status === 500 && error.error && error.error.message) {
        this.utilities.showSnackBar(`Error: ${error.error.message}`, 'OK');
      } else {
        this.utilities.showSnackBar('task could not be updated', 'OK');
      }
    });
  }

  changeTaskState(tasks: any[], taskState: string) {
    if (tasks && tasks.length > 0 && taskState !== undefined && taskState !== null) {
      this.dataProviderService.updateStatePickTaskList(tasks, taskState)
      .subscribe(response => {
        if (response) {
          tasks.forEach(task => {
            task.taskState = taskState;
          });
          this.utilities.log('task state change response', response);
          this.utilities.showSnackBar('Task state changed successfully', 'OK');
        }
      }, error => {
        this.utilities.error('task state change error', error);
        if (error.status === 500 && error.error && error.error.message) {
          this.utilities.showSnackBar(`Error: ${error.error.message}`, 'OK');
        } else {
          this.utilities.showSnackBar('Task state could not be changed', 'OK');
        }
      });
    } else {
      this.utilities.error('Error on selected task or selected state');
      this.utilities.showSnackBar('Error on selected task or selected state', 'OK');
    }
  }

  generateTaskPdf(object: any, action: string) {
    const groupedData = {};
    const newTableData = [];
    this.utilities.log('gerating report of task ', object);
    this.dataProviderService.getAllPickTaskLinesByLines(object.pickTaskId).subscribe((taskLines: any) => {
      this.utilities.log('taskLines: ', taskLines);
      if (taskLines && taskLines.content) {
        taskLines = taskLines.content.map((taskLine: any) => {
          if (action === 'viewBySku') {
            this.utilities.log(`Agrupar por sku`);
            if (groupedData[taskLine.sku] !== undefined && groupedData[taskLine.sku] !== null) {
              this.utilities.log(`el grupo por sku ${taskLine.sku} existe`);
              groupedData[taskLine.sku][2].text = Number(groupedData[taskLine.sku][2].text) + Number(taskLine.qtyToPicked);
              groupedData[taskLine.sku][3].text = Number(groupedData[taskLine.sku][3].text) + Number(taskLine.qtyToSelected);
            } else {
              this.utilities.log(`el grupo por sku ${taskLine.sku} no existe`);
              groupedData[taskLine.sku] = [
                // { text: taskLine.pickTaskLineId, style: 'tableRow' },
                { text: taskLine.sku, style: 'tableRow' },
                { text: taskLine.skuDescription, style: 'tableRow' },
                // { text: taskLine.batchNumber, style: 'tableRow' },
                // { text: taskLine.serial, style: 'tableRow' },
                // { text: taskLine.locationCode, style: 'tableRow' },
                // { text: taskLine.expiryDate, style: 'tableRow' },
                // { text: taskLine.uomCode, style: 'tableRow' },
                // { text: taskLine.lpnCode, style: 'tableRow' },
                /*{ text: taskLine.scannedVerification, style: 'tableRow'},*/
                { text: taskLine.qtyToPicked, style: 'tableRow' },
                { text: taskLine.qtyToSelected, style: 'tableRow' }
              ];
            }
          } else if (action === 'viewByLine') {
            this.utilities.log(`Agrupar por line`);
            newTableData.push([
              { text: taskLine.pickTaskLineId, style: 'tableRow' },
              { text: taskLine.sku, style: 'tableRow' },
              { text: taskLine.skuDescription, style: 'tableRow' },
              { text: taskLine.batchNumber, style: 'tableRow' },
              { text: taskLine.serial, style: 'tableRow' },
              { text: taskLine.locationCode, style: 'tableRow' },
              { text: taskLine.expiryDate, style: 'tableRow' },
              { text: taskLine.uomCode, style: 'tableRow' },
              { text: taskLine.lpnCode, style: 'tableRow' },
              /*{ text: taskLine.scannedVerification, style: 'tableRow'},*/
              { text: taskLine.qtyToPicked, style: 'tableRow' },
              { text: taskLine.qtyToSelected, style: 'tableRow' }
            ]);
          }
        });
        if (action === 'viewBySku') {
          Object.keys(groupedData).forEach(sku => {
            newTableData.push(groupedData[sku]);
          });
        }
        this.utilities.log('taskLines newData: ', newTableData);
        this.utilities.generateTaskPdfContent(object, newTableData, action)
        .subscribe(documentDefinition => {
          this.utilities.log('documentDefinition: ', documentDefinition);
          pdfMake.createPdf(documentDefinition).open();
        });
      }
    }, error => {
      this.utilities.error('Error al cargar task lines', error);
      if (error && error.error.message) {
        this.utilities.showSnackBar(error.error.message, 'OK');
      } else {
        this.utilities.showSnackBar('Error fetching task lines', 'OK');
      }
    });
  }

  init() {
    this.utilities.log('pick planning', this.row);
    this.getPickTaskList();
    this.getDockList();
    this.getTransportList();
    this.getPickPlanningStates();
    // inicializamos todo lo necesario para la tabla
    if (this.row) {
      this.dataSource.data = this.pickPlanningData.pickTaskList;
      // inicializar tabla mat-table
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla de pick task
    }
    if (this.row) {
      this.dataSourceTransports.data = this.pickPlanningData.transportList;
      // inicializar tabla mat-table
      this.utilities.log('dataSourceTransports.data', this.dataSourceTransports.data);
      this.displayedDataColumnsTransports = Object.keys(this.definitionsTransports);
      this.utilities.log('displayedDataColumnsTransports', this.displayedDataColumnsTransports);
      // this.displayedHeadersColumnsTransports = ['select'].concat(Object.keys(this.definitionsTransports));
      this.displayedHeadersColumnsTransports = Object.keys(this.definitionsTransports);
      this.displayedHeadersColumnsTransports.push('options');
      this.utilities.log('displayedHeadersColumnsTransports', this.displayedHeadersColumnsTransports);
      this.initColumnsDefsTransports(); // columnas a mostrarse en la tabla de transports
    }
    this.form = new FormGroup({
      targetDockId: new FormControl(this.row.targetDockId),
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
        shouldShow = index === this.displayedHeadersColumns.length - 1 || index < 7;
        return {show: shouldShow, name: columnName};
      });
    }
    aux = this.columnDefs.slice();
    aux.pop();
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
        shouldShow = index === this.displayedHeadersColumnsTransports.length - 1 || index < 7;
        return {show: shouldShow, name: columnName};
      });
    }
    aux = this.columnDefsTransports.slice();
    aux.pop();
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
    if (index > -1) {
      this.pickPlanningData.pickTaskList.splice(index, 1);
    }
  }

  deleteTransport(row: any) {
    const index = this.pickPlanningData.transportList.findIndex((_row: any) => _row.id === row.id);
    if (index > -1) {
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
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.id;
    delete dataToExport.ownerId;
    this.utilities.exportToXlsx(dataToExport, 'Pick Planning ' + this.row.id);
  }

  exportPickTasks() {
    const dataCopy = JSON.parse(JSON.stringify(this.dataSource.data));
    const dataToExport = dataCopy.map((row: any) => {
      delete row.id;
      delete row.pickTaskId;
      delete row.index;
      delete row.ownerId;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Pick Planning Tasks List');
  }

  exportTransports() {
    const dataCopy = JSON.parse(JSON.stringify(this.dataSourceTransports.data));
    const dataToExport = dataCopy.map((row: any) => {
      delete row.id;
      delete row.index;
      delete row.ownerId;
      delete row.orders;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Pick Planning Transports List');
  }

  addTransport() {
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(SearchTransportDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      this.utilities.log('hay que agregarlo a esta lista:', result);
      if (result) {
        // TODO: consumir servicio para persistir esto
        // TODO: eliminar esto cuando se use el endpoint
        this.pickPlanningData.transportList.push(result);
        this.dataSourceTransports.data = this.pickPlanningData.transportList;
        // fin TODO
        if(!result){
          this.getTransportList()
        }
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
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
    this.dataSource.paginator = this.paginatorTasks;
    this.dataSource.sort = this.sortTasks;
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
    this.dataProviderService.getAllPickPlanningTasksVO3(this.row.id).subscribe(results => {
      if (results && results.content) {
        this.pickPlanningData.pickTaskList = results.content.map(el => {
          el.id = el.pickTaskId
          return el
        });
        this.dataSource.data = this.pickPlanningData.pickTaskList;
        this.refreshTable();
        this.utilities.log('pick task list', this.pickPlanningData.pickTaskList);
      }
    });
  }

  getTransportList() {
    this.dataProviderService.getPickPlanningTransport(this.row.id).subscribe((transports: any) => {
      this.pickPlanningData.transportList = transports;
      this.dataSourceTransports.data = transports;
      this.utilities.log('pick planning transports', transports);
      transports.forEach(transport => {
        this.dataProviderService.getTransportsOrders(transport.id).subscribe(orders => {
          transport.orders = orders;
        });
      });
    });
  }

  getPickPlanningStates() {
    this.dataProviderService.getAllPickPlanningStates().subscribe(result => {
      this.pickPlanningData.pickPlanningStates = result;
      this.utilities.log('pick planning states', result);
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
    this.dataSource.paginator = this.paginatorTasks;
    this.dataSource.sort = this.sortTasks;
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string,
      type: string
    }) => {
      this.viewMode = data.viewMode;
      this.pageTitle = this.viewMode === 'edit' ? 'Edit Pick Planning' : 'View Pick Planning';
      this.type = data.type;
      this.remoteSync = true;
      this.utilities.log('viewMode', this.viewMode);
      data.row.subscribe(element => {
        this.isLoadingResults = false;
        this.utilities.log('ngOnInit => row received', element);
        this.row = element;
        this.cardTitle = 'Pick Planning # ' + this.row.id;
        this.init();
      });
    });
  }
}
