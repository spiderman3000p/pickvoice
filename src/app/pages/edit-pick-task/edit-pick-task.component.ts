import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { User, PickTaskLine, TaskType } from '@pickvoice/pickvoice-api';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
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
import { MessageService } from 'src/app/services/websocket.service';

interface PickTaskData {
  taskStateList: string[];
  // pickTaskLines: PickTaskLine[];
  pickTaskLines: any[];
  taskTypesList: TaskType[];
  userList: User[];
}
@Component({
  selector: 'app-edit-pick-task',
  templateUrl: './edit-pick-task.component.html',
  styleUrls: ['./edit-pick-task.component.scss']
})

export class EditPickTaskComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.PICK_TASKS;
  dataMap = ModelMap.PickTaskMap;
  definitions = ModelMap.PickTaskLineMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  pickTaskData: PickTaskData;
  selectedUser: User;

  columnDefs: any[] = [];
  dataSource: MatTableDataSource<PickTaskLine>;
  displayedDataColumns: string[] = [];
  displayedHeadersColumns: any[] = [];
  defaultColumnDefs: any[] = [];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  selection = new SelectionModel<PickTaskLine>(true, []);
  states = STATES;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService, private location: WebLocation,
    private activatedRoute: ActivatedRoute, private dataProviderService: DataProviderService,
    private router: Router, private dialog: MatDialog, private messageService: MessageService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.pickTaskData = new Object() as PickTaskData;
    this.pickTaskData.taskStateList = [];
    this.pickTaskData.pickTaskLines = [];
    this.pickTaskData.taskTypesList = [];
    this.pickTaskData.userList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Pick Task' : 'View Pick Task';
    this.isLoadingResults = true;
    this.messageService.subject.subscribe(message => {
      console.log('mensaje recibido en edit pick task', message);
      if (message.taskId && message.taskLineId && message.qtySelected && message.taskId === this.row.id) {
        const index = this.pickTaskData.pickTaskLines.findIndex(line => line.pickTaskLineId === message.taskLineId);
        if (index > -1) {
          this.pickTaskData.pickTaskLines[index].qtyToSelected = message.qtySelected;
          document.getElementById('qtyToSelected'+message.taskLineId).classList.add('active');
          setTimeout(() => {
            document.getElementById('qtyToSelected'+message.taskLineId).classList.add('active-out');
            document.getElementById('qtyToSelected'+message.taskLineId).classList.remove('active');
            setTimeout(() => {
              document.getElementById('qtyToSelected'+message.taskLineId).classList.remove('active-out');
            }, 1000);
          }, 1000);
        }
      }
    });
    /*setTimeout(() => {
      this.messageService.sendMessage(JSON.stringify({taskId: 4, taskLineId: 9, qtySelected: 5}));
    }, 5000);
    setTimeout(() => {
      this.messageService.sendMessage(JSON.stringify({taskId: 4, taskLineId: 10, qtySelected: 10}));
    }, 8000);
    setTimeout(() => {
      this.messageService.sendMessage(JSON.stringify({taskId: 4, taskLineId: 11, qtySelected: 15}));
    }, 10000);*/
    this.form = new FormGroup({
      description: new FormControl(''),
      enableDate: new FormControl(''),
      dateAssignment: new FormControl(''),
      date: new FormControl(''),
      priority: new FormControl(''),
      lines: new FormControl(''),
      qty: new FormControl(''),
      document: new FormControl(''),
      taskState: new FormControl(''),
      userId: new FormControl(''),
      taskTypeId: new FormControl(''),
      currentLine: new FormControl(''),
      childrenWork: new FormControl('')
    });
    this.form.get('userId').valueChanges.subscribe(userId => {
      this.selectedUser = this.pickTaskData.userList.find((user: any) => user.id === userId);
    });
    this.selectedUser = new Object() as User;
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  init() {
    this.utilities.log('pick task', this.row);
    this.getTaskStateList();
    this.getTaskLineList();
    this.getTaskTypesList();
    this.getUserList();
    // inicializamos todo lo necesario para la tabla
    if (this.row) {
      this.dataSource.data = this.pickTaskData.pickTaskLines;
      // inicializar tabla mat-table
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = Object.keys(this.definitions);
      // this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla
    }
    this.form = new FormGroup({
      description: new FormControl(this.row.description),
      enableDate: new FormControl(this.row.enableDate),
      dateAssignment: new FormControl(this.row.dateAssignment),
      date: new FormControl(this.row.date),
      priority: new FormControl(this.row.priority),
      lines: new FormControl(this.row.lines),
      qty: new FormControl(this.row.qty),
      document: new FormControl(this.row.document),
      taskState: new FormControl(this.row.taskState),
      userId: new FormControl(this.row.userId),
      taskTypeId: new FormControl(this.row.taskTypeId),
      currentLine: new FormControl(this.row.currentLine),
      childrenWork: new FormControl(this.row.childrenWork)
    });
    this.form.get('userId').valueChanges.subscribe(userId => {
      this.selectedUser = this.pickTaskData.userList.find((user: any) => user.id === userId);
    });
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInPickTaskPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInPickTaskPage'));
    } else {
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        shouldShow = index < 7;
        return {show: shouldShow, name: columnName};
      });
    }

    aux = this.columnDefs.slice();
    aux.pop();
    this.defaultColumnDefs = aux;

    this.columnDefs.forEach((column, index) => {
      if (index < this.columnDefs.length - 1) {
        filter = new Object();
        filter.show = column.show;
        filter.name = this.definitions[column.name].name;
        filter.key = column.name;
        formControls[column.name] = new FormControl('');
        // this.utilities.log(`new formControl formControls[${column.name}]`, formControls[column.name]);
        // this.utilities.log('formControls', formControls);
        filter.control = formControls[column.name];
        filter.formControl = this.definitions[column.name].formControl;
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
    localStorage.setItem('displayedColumnsInPickTaskPage', JSON.stringify(this.columnDefs));
    // this.utilities.log('displayed column after', this.columnDefs);
  }

  deleteRows(rows: any) {
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        // TODO: tener servicio para eliminar registros de pick tasks
        this.deletePickTaskLine(row);
      });
    } else {
      this.deletePickTaskLine(rows);
    }
  }

  deletePickTaskLine(row: any) {
    const index = this.pickTaskData.pickTaskLines.findIndex(_row => _row.pickTaskLineId === row.pickTaskLineId);
    console.log('index', index);
    if (index > -1) {
      this.pickTaskData.pickTaskLines.splice(index, 1);
      this.refreshTable();
    }
  }

  deletePickTaskLinePrompt(rows?: any) {
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

  editTaskLineOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        viewMode: mode,
        type: IMPORTING_TYPES.PICK_TASKLINES,
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

  addPickTaskLine() {
    this.utilities.log('map to send to add dialog', this.definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.PICK_TASKLINES,
        remoteSync: false, // para mandar los datos a la BD por la API
        title: 'Add New Task Line'
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

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.id;
    delete dataToExport.ownerId;
    this.utilities.exportToXlsx(dataToExport, 'Pick Task ' + this.row.id);
  }

  exportPickTaskLines() {
    const dataToExport = this.dataSource.data.slice().map((row: any) => {
      delete row.id;
      delete row.index;
      delete row.ownerId;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Pick Task Lines List');
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

  getTaskStateList() {
    this.dataProviderService.getAllPickTaskStates().subscribe(results => {
      this.pickTaskData.taskStateList = results;
    });
  }

  getTaskTypesList() {
    this.dataProviderService.getAllPickTaskTypes().subscribe(results => {
      this.pickTaskData.taskTypesList = results;
    });
  }

  getUserList() {
    this.dataProviderService.getAllUsers().subscribe(results => {
      this.pickTaskData.userList = results;
      this.selectedUser = this.pickTaskData.userList.find((user: any) => user.id === this.row.userId);
    });
  }

  getTaskLineList() {
    this.dataProviderService.getAllPickTaskLinesByTask(this.row.id).subscribe(results => {
      this.pickTaskData.pickTaskLines = results;
      this.dataSource.data = this.pickTaskData.pickTaskLines;
      this.refreshTable();
      this.utilities.log('pick task lines', this.pickTaskData.pickTaskLines);
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
      this.dataProviderService.updatePickTask(toUpload, this.row.id, 'response').pipe(retry(3))
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
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        if (objectType === IMPORTING_TYPES.PICK_TASKLINES) {
          this.pickTaskData.pickTaskLines.push(result);
        }
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

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string,
      type: string
    }) => {
      this.viewMode = data.viewMode;
      this.pageTitle = this.viewMode === 'edit' ? 'Edit Pick Task' : 'View Pick Task';
      this.type = data.type;
      this.utilities.log('viewMode', this.viewMode);
      data.row.subscribe(element => {
        this.isLoadingResults = false;
        this.utilities.log('ngOnInit => row received', element);
        this.row = element;
        this.cardTitle = 'Pick Task # ' + this.row.id;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
