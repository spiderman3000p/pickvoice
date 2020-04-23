import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { environment } from '../../../environments/environment';
import { ItemUom, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { PrintComponent } from '../../components/print/print.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { SharedDataService } from '../../services/shared-data.service';
import { merge, Subscription, from, Observable, Observer } from 'rxjs';
import { takeLast, retry, switchMap } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NumericEditorComponent } from './numeric-editor.component';

interface ItemData {
  uomsList: UnityOfMeasure[];
  statesList: string[];
  itemTypeList: ItemType[];
  classificationsList: string[];
}
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})

export class EditItemComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.ITEMS;
  dataMap = ModelMap.ItemMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  itemData: ItemData;
  /* para tabla ag-grid */
  gridApi;
  gridColumnApi;
  frameworkComponents: any;
  itemUomsColDefs: any[] = [
    {
      headerName: 'DENOMINATOR',
      field: 'denominator',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'NUMERATOR',
      field: 'numerator',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'FACTOR',
      field: 'factor',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'LENGTH',
      field: 'length',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'WIDTH',
      field: 'width',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'HEIGHT',
      field: 'height',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'EAN CODE',
      field: 'eanCode',
      editable: true
    },
    {
      headerName: 'UOM',
      field: 'uom',
      valueFormatter: uomFormatter,
      valueParser: uomParser,
      /*valueGetter: uomGetter,
      valueSetter: uomSetter,*/
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.selectsData.uom.map(uom => uom.code)
        };
      },
      editable: true
    },
    {
      headerName: 'OPTIONS',
      field: 'options'
    }
  ];
  itemUomsData: any = [];
  /* para tabla de item uoms */
  definitions: any = ModelMap.ItemUomMap;
  dataSource: MatTableDataSource<ItemUom>;
  dataToSend: ItemUom[];
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
  selection = new SelectionModel<any>(true, []);
  selectsData: any;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService, private router: Router, private dialog: MatDialog
  ) {
    this.itemData = new Object() as ItemData;
    this.itemData.uomsList = [];
    this.itemData.statesList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Item' : 'View Item';
    this.isLoadingResults = true;
    /* para tabla ag-grid */
    this.displayedDataColumns = Object.keys(this.definitions);
    this.frameworkComponents = {
      /*moodRenderer: MoodRenderer,
      moodEditor: MoodEditor,*/
      numericEditor: NumericEditorComponent,
    };
    /* para tabla de item uom */
    /*this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
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
    */
    this.initColumnsDefs(); // columnas a mostrarse
  }

  init() {
    this.utilities.log('item', this.row);
    this.getUomsList();
    this.getStatesList();
    this.getItemTypeList();
    this.getClassificationsList();
    this.form = new FormGroup({
      description: new FormControl(this.row.description),
      sku: new FormControl(this.row.sku),
      upc: new FormControl(this.row.upc),
      phonetic: new FormControl(this.row.phonetic),
      itemType: new FormControl(this.row.itemType),
      uom: new FormControl(this.row.uom),
      weight: new FormControl(this.row.weight),
      variableWeight: new FormControl(this.row.variableWeight),
      weightTolerance: new FormControl(this.row.weightTolerance),
      expiryDate: new FormControl(this.row.expiryDate),
      serial: new FormControl(this.row.serial),
      batchNumber: new FormControl(this.row.batchNumber),
      scannedVerification: new FormControl(this.row.scannedVerification),
      spokenVerification: new FormControl(this.row.spokenVerification),
      state: new FormControl(this.row.state),
      classification: new FormControl(this.row.classification),
      cost: new FormControl(this.row.cost),
      tolerance: new FormControl(this.row.tolerance),
      shelfLife: new FormControl(this.row.shelfLife)
    });
    // this.loadData();
    this.itemUomsData = this.dataProviderService.getAllItemUoms(this.row.id);
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = this.row;
    this.utilities.exportToXlsx(dataToExport, 'Item # ' + this.row.sku);
  }

  getUomsList() {
    this.dataProviderService.getAllUoms().subscribe(results => {
      this.itemData.uomsList = results;
      this.utilities.log('uoms list', this.itemData.uomsList);
    });
  }

  getStatesList() {
    this.itemData.statesList = Object.keys(Item.StateEnum);
  }

  getClassificationsList() {
    this.itemData.classificationsList = Object.keys(Item.ClassificationEnum);
  }

  getItemTypeList() {
    this.dataProviderService.getAllItemTypes().subscribe(results => {
      this.itemData.itemTypeList = results;
      this.utilities.log('item types list', this.itemData.itemTypeList);
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
      this.dataProviderService.updateItem(toUpload, this.row.id, 'response').pipe(retry(3))
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
        remoteSync: true, // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        if (objectType === IMPORTING_TYPES.UOMS) {
          this.itemData.uomsList.push(result);
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
        this.cardTitle = 'Item # ' + this.row.id;
        this.init();
      });
      this.remoteSync = true;
    });
    /* para la tabla de item uom */
    /*this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
  }

  /* Metodos para la tabla de item uom */
  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    /*if (localStorage.getItem('displayedColumnsInEditItemPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInEditItemPage'));
    } else {
      this.columnDefs = this.displayedHeadersColumns.map((columnName, index) => {
        shouldShow = index === 0 || index === this.displayedHeadersColumns.length - 1 || index < 7;
        return {show: shouldShow, name: columnName};
      });
    }*/
    /*aux = this.columnDefs.slice();
    aux.pop();
    aux.shift();
    this.defaultColumnDefs = aux;
    this.selectsData = {};
    this.columnDefs.forEach((column, index) => {
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
    this.utilities.log('formControls', formControls);
    */
    this.selectsData = {};
    for (let key in this.definitions) {
      if (this.definitions[key].formControl.control === 'select') {
        this.dataProviderService.getDataFromApi(this.definitions[key].type).subscribe(result => {
          this.selectsData[key] = result;
        });
      }
    }
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
    localStorage.setItem('displayedColumnsInEditItemPage', JSON.stringify(this.columnDefs));
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
        requests.push(this.dataProviderService.deleteItemUom(row.id, 'response', false));
      });
      this.subscriptions.push(merge(requests).pipe(takeLast(1)).subscribe(observer));
    } else {
      this.subscriptions.push(this.dataProviderService.deleteItemUom(rows.id, 'response', false)
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

  resetFilters() {
    this.filtersForm.reset();
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
    this.dataSource.filterPredicate = (data: ItemUom, filter: string) => {
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
  }

  editRowOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        type: IMPORTING_TYPES.ITEMUOMS,
        remoteSync: true, // para mandar los datos a la BD por la API
        viewMode: mode,
        defaultValues: {
          item: this.row
        }
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

  loadData(useCache = true) {
    this.utilities.log('requesting item uoms');
    this.isLoadingResults = true;
    this.subscriptions.push(this.dataProviderService.getAllItemUoms(this.row.id)
    .subscribe(results => {
      this.isLoadingResults = false;
      this.utilities.log('item uoms received', results);
      if (results && results.length > 0) {
        /*this.dataSource.data = results.map((element, i) => {
          return { index: i, ... element};
        });
        this.refreshTable();*/
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.selection.clear();
    this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.itemUoms);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.definitions,
        type: IMPORTING_TYPES.ITEMUOMS,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New Item Uom',
        defaultValues: {
          item: this.row
        }
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        // this.dataSource.data.push(result);
        this.itemUomsData = this.dataProviderService.getAllItemUoms(this.row.id);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  exportTableData() {
    const dataToExport = this.dataSource.data.map((row: any) => {
      return this.utilities.getJsonFromObject(row, IMPORTING_TYPES.ITEMUOMS);
    });
    this.utilities.exportToXlsx(dataToExport, 'Item Uoms List');
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

  updateItemUom(event) {
    console.log(event);
    const itemUom = event.data;
    console.log('updateItemUom', event.params);
    itemUom.uom = this.selectsData.uom.find(uom => uom.code === itemUom.uom);
    this.dataProviderService.updateItemUom(itemUom, itemUom.id).subscribe(result => {
      this.utilities.log('item uom update result', result);
      if (result) {
        this.utilities.showSnackBar('Item uom updated successfully', 'OK');
      }
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // new EventListener(this.gridApi.onRow)
  }
  /* fin de metodos para la tabla de item uoms */
}

function uomFormatter(params) {
  console.log('uomFormatter', params.value);
  return params.value.code;
}

function uomParser(params) {
  console.log('uomParser', params);
  return params.newValue.code;
}

function uomGetter(params) {
  console.log('uomGetter', params);
  return params.data.uom.name;
}

function uomSetter(params) {
  console.log('uomSetter', params);
  params.data.uom = params.newValue;
  return true;
}