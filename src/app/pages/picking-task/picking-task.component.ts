import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { UserSelectorDialogComponent } from '../../components/user-selector-dialog/user-selector-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap, STATES, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { PickTask, PickTaskLine, PickTaskLines, LoadPick } from '@pickvoice/pickvoice-api';

import { takeLast, debounceTime, distinctUntilChanged, retry, tap } from 'rxjs/operators';
import { merge, Observable, Observer, Subscription } from 'rxjs';

import { MyDataSource } from '../../models/my-data-source';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-picking-task',
  templateUrl: './picking-task.component.html',
  styleUrls: ['./picking-task.component.css']
})
export class PickingTaskComponent implements OnInit, OnDestroy, AfterViewInit {
  definitions: any = ModelMap.PickTaskMap;
  dataSource: MyDataSource<PickTask>;
  dataToSend: PickTask[];
  displayedDataColumns: string[];
  displayedHeadersColumns: any[];
  columnDefs: any[];
  defaultColumnDefs: any[];

  pageSizeOptions = [5, 10, 15, 30, 50, 100];

  searchForm: FormGroup;
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
  type = IMPORTING_TYPES.PICK_TASKS;
  selectsData: any;
  subscriptions: Subscription[] = [];
  parserFn: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(ContextMenuComponent) public basicMenuC: ContextMenuComponent;
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService) {

      this.dataToSend = [];
      this.showFilters = true;
      this.actionForSelected = new FormControl('');
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse
      this.utilities.log('filters', this.filters);
      this.subscriptions.push(this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      }));
      this.subscriptions.push(this.selection.changed.subscribe(selected => {
        this.utilities.log('new selection', selected);
      }));
      this.parserFn = (element: any, index) => {
        element.user = (element.user && element.user.firstName ? element.user.firstName : '') + ' ' +
        (element.user && element.user.lastName ? element.user.lastName : '') +
        (element.user && element.user.userName ? '(' + element.user.userName + ')' : '');
        element.taskType = element.taskType && element.taskType.name ? element.taskType.name : '';
        return element;
      };
      // inicializar formulario de busqueda
      this.searchForm = new FormGroup({
        process: new FormControl(''),
        order: new FormControl(''),
        transport: new FormControl(''),
        description: new FormControl(''),
        state: new FormControl(''),
        startOrder: new FormControl(''),
        purchaseOrder: new FormControl('')
      });
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
    this.subscriptions.push(this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0));
    this.subscriptions.push(merge(this.sort.sortChange, this.paginator.page)
    .pipe(tap(() => this.loadDataPage()))
    .subscribe());
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
        dialogRef.afterClosed().subscribe(selectedUser => {
          this.utilities.log('user selector dialog result:', selectedUser);
          if (selectedUser === null) {
            return;
          }
          if (selectedUser && selectedTasks.length > 0) {
            this.assignUserToTaskList(selectedTasks, selectedUser);
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

  assignUserToTaskList(tasks: any[], user: any) {
    this.dataProviderService.assignUserToPickTaskList(tasks, user)
    .subscribe(response => {
      this.utilities.log('assign user to task list response', response);
      if (response) {
        tasks.forEach(task => {
          task.user = user;
        });
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
    this.dataProviderService.updatePickTask(newTask, oldTask.id).subscribe(response => {
      if (response) {
        oldTask.priority = newTask;
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

  generateTaskPdf(object?: any, action?: string) {
    const groupedData = {};
    const newTableData = [];
    this.dataProviderService.getAllPickTaskLinesByLines(object.id).subscribe(taskLines => {
      this.utilities.log('taskLines: ', taskLines);
      taskLines = taskLines.map((taskLine: any) => {
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
    }, error => {
      this.utilities.error('Error al cargar task lines', error);
      if (error && error.error.message) {
        this.utilities.showSnackBar(error.error.message, 'OK');
      } else {
        this.utilities.showSnackBar('Error fetching task lines', 'OK');
      }
    });
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
    this.utilities.log('paramsArray', paramsArray);
    const params = paramsArray.length > 0 ? paramsArray.join(';') : '';
    this.utilities.log('loading data with params', params);
    this.subscriptions.push(this.dataSource.loadData(this.type, `${params}`)
    .subscribe((response: any) => {
        /*this.data = dataResults;
        this.dataCount = 100;
        this.dataSubject.next(dataResults);*/
        this.utilities.log('response', response);
        if (response && response.content) {
            this.dataSource.lastRow = response.pageSize;
            this.dataSource.data = response.content.map(this.parserFn);
            this.dataSource.dataCount = response.totalElements;
            this.dataSource.dataSubject.next(this.dataSource.data);
        }
    }, error => {
      this.utilities.error('Error fetching data from server');
      this.utilities.showSnackBar('Error fetching data from server', 'OK');
    }));
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

  search() {
    
  }

  isFilteredBy(column: string): boolean {
    return this.filterParams.includes(column);
  }

  clearFilterInColumn(column: string) {
    this.filters[column].controls.value.reset();
    this.filters[column].controls.type.patchValue(FILTER_TYPES[0].value);
    this.filteredDone = this.filterParams.length > 0;
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInPickingTasksPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInPickingTasksPage'));
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
            this.definitions[column.name].formControl.control !== 'toggle' &&
            this.definitions[column.name].formControl.control !== 'table') {
          filter.availableTypes = FILTER_TYPES.filter(_filterType => _filterType.availableForTypes
            .findIndex(availableType => filter.type === availableType
            || availableType === 'all') > -1);
        } else {
          // aqui en caso de querer hacer algo con los campos select y toggle
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
          this.subscriptions.push(
            this.dataProviderService.getDataFromApi(this.definitions[column.name].type)
            .subscribe(results => {
              this.selectsData[column.name] = results;
              this.utilities.log('selectsData', this.selectsData);
            }, error => {
              this.utilities.error('Error: no hay datos de seleccion para el campo', this.definitions[column.name]);
            })
          );
          // formControls[column.name].get('value').patchValue(-1);
         // this.utilities.log('selectsData: ', this.selectsData);
        }
        this.filters[column.name] = filter;
      }
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('filters', this.filters);
    this.utilities.log('formControls', formControls);
    this.utilities.log('form values', this.filtersForm.value);
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
    localStorage.setItem('displayedColumnsInPickTasksPage', JSON.stringify(this.columnDefs));
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
      error: (response) => {
        this.utilities.error('Error on delete rows', response);
        if (deletedCounter === 0) {
          if (response.error && response.error.errors && response.error.errors[0].includes('foreign')) {
            this.utilities.showSnackBar('This record cant be deleted because it is in use', 'OK');
          } else {
            this.utilities.showSnackBar('Error on delete row', 'OK');
          }
        }
        deletedCounter++;
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      const requests = [];
      rows.forEach(row => {
        requests.push(this.dataProviderService.deletePickTask(row.id, 'response', false));
      });
      this.subscriptions.push(merge(requests).pipe(takeLast(1)).subscribe(observer));
    } else {
      this.subscriptions.push(this.dataProviderService.deletePickTask(rows.id, 'response', false)
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
        map: this.utilities.dataTypesModelMaps.locations,
        type: IMPORTING_TYPES.LOCATIONS,
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
        map: this.utilities.dataTypesModelMaps.pickTasks,
        type: IMPORTING_TYPES.PICK_TASKS,
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

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.pickTasks);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.pickTasks,
        type: IMPORTING_TYPES.PICK_TASKS,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Task'
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
    this.utilities.exportToXlsx(dataToExport, 'Uoms List');
  }

  /*
    Esta funcion se encarga de refrescar la tabla cuando el contenido cambia.
    TODO: mejorar esta funcion usando this.dataSource y no el filtro
  */
  private refreshTable() {
    this.loadDataPage();
    /*
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
    this.dataSource.sort = this.sort;*/
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
