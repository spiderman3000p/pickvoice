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
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { NumericEditorComponent } from './numeric-editor.component';
import { RowOptionComponent } from './row-option.component';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, Observable, Observer } from 'rxjs';
import '@ag-grid-enterprise/excel-export';
import { AgGridAngular } from 'ag-grid-angular';

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
  uomGetter: any;
  uomSetter: any;
  itemUomsColDefs: any[] = [
    {
      headerName: 'DENOMINATOR',
      field: 'denominator',
      width: 120,
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
      headerName: 'UNITS PALLET',
      field: 'unitsPallet',
      width: 100,
      cellEditor: 'numericEditor',
      editable: true
    },
    {
      headerName: 'EAN CODE',
      field: 'eanCode',
      editable: true,
      width: 100,
    },
    {
      headerName: 'UOM',
      field: 'uomId',
      // valueFormatter: null,
      // valueParser: null,
      valueGetter: null,
      valueSetter: null,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.itemData.uomsList.map(el => el.name)
        };
      },
      width: 150,
      editable: true
    },
    {
      headerName: 'DIMENSION UOM',
      field: 'dimensionUomId',
      // valueFormatter: null,
      // valueParser: null,
      valueGetter: null,
      valueSetter: null,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.itemData.uomsList.map(el => el.name)
        };
      },
      width: 150,
      editable: true
    },
    {
      headerName: 'VOLUMEN UOM',
      field: 'volumenUomId',
      // valueFormatter: null,
      // valueParser: null,
      valueGetter: null,
      valueSetter: null,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.itemData.uomsList.map(el => el.name)
        };
      },
      width: 150,
      editable: true
    },
    {
      headerName: 'WEIGHT UOM',
      field: 'weightUomId',
      // valueFormatter: null,
      // valueParser: null,
      valueGetter: null,
      valueSetter: null,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.itemData.uomsList.map(el => el.name),
          formatValue: (param) => {
            console.log('formatValue: ', param);
            return param.name;
          }
        };
      },
      width: 150,
      editable: true
    },
    {
      headerName: 'OPTIONS',
      field: 'options',
      cellRenderer: 'rowOption',
      cellRendererParams: {
        deleteItemUom: this.deletePrompt.bind(this),
        startEditItemUom: this.startEditItemUom.bind(this),
        finishEditItemUom: this.finishEditItemUom.bind(this),
      }
    }
  ];
  itemUomsData = [];
  definitions: any = ModelMap.ItemUomMap;
  dataToSend: ItemUom[];
  selectsData: any;
  subscriptions: Subscription[] = [];
  @ViewChild('agGrid') agGrid: AgGridAngular;
  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService, private router: Router,
    private dialog: MatDialog
  ) {
    this.itemData = new Object() as ItemData;
    this.itemData.uomsList = [];
    this.itemData.statesList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Item' : 'View Item';
    this.isLoadingResults = true;
    this.form = new FormGroup({
      description: new FormControl(''),
      sku: new FormControl(''),
      upc: new FormControl(''),
      phonetic: new FormControl(''),
      itemTypeId: new FormControl(''),
      uomId: new FormControl(''),
      weight: new FormControl(''),
      variableWeight: new FormControl(''),
      weightTolerance: new FormControl(''),
      expiryDate: new FormControl(''),
      serial: new FormControl(''),
      batchNumber: new FormControl(''),
      scannedVerification: new FormControl(''),
      spokenVerification: new FormControl(''),
      state: new FormControl(''),
      classification: new FormControl(''),
      cost: new FormControl(''),
      tolerance: new FormControl(''),
      shelfLife: new FormControl(''),
      uomHandlingId: new FormControl(''),
      uomPackingId: new FormControl(''),
      uomInboundId: new FormControl(''),
      uomOutboundId: new FormControl('')
    });
    /* para tabla ag-grid */
    this.frameworkComponents = {
      /*moodRenderer: MoodRenderer,
      moodEditor: MoodEditor,*/
      rowOption: RowOptionComponent,
      numericEditor: NumericEditorComponent,
    };
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
      itemTypeId: new FormControl(this.row.itemTypeId),
      uomId: new FormControl(this.row.uomId),
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
      shelfLife: new FormControl(this.row.shelfLife),
      uomHandlingId: new FormControl(this.row.uomHandlingId),
      uomPackingId: new FormControl(this.row.uomPackingId),
      uomInboundId: new FormControl(this.row.uomInboundId),
      uomOutboundId: new FormControl(this.row.uomOutboundId)
    });
    // this.loadData();
    this.dataProviderService.getAllItemUoms(this.row.id).subscribe(result => {
      if (result && Array.isArray(result)) {
        this.itemUomsData = result;
      }
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.id;
    delete dataToExport.ownerId;
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
    this.dataProviderService.getAllItemTypes().subscribe((results: any) => {
      this.itemData.itemTypeList = results;
      this.utilities.log('item types list', this.itemData.itemTypeList);
    }, error => {
      this.utilities.error('Error al obtener lista de items types');
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
      this.dataProviderService.updateItem(toUpload, this.row.id, 'response')
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

  /* Metodos para la tabla de item uom */
  initColumnsDefs() {
    this.selectsData = {};
    for (let key in this.definitions) {
      if (this.definitions[key].formControl.control === 'select') {
        if (this.definitions[key].type !== IMPORTING_TYPES.UOMS) {
          this.dataProviderService.getDataFromApi(this.definitions[key].type).subscribe(result => {
            if (result && result.content && result.pageSize) {
              this.selectsData[key] = result.content;
            } else {
              this.selectsData[key] = result;
            }
          });
        } else {
          this.selectsData[key] = this.itemData.uomsList;
        }
      }
    }
  }

  deletePrompt(params: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteItemUom(params);
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
    this.loadData(false);
  }

  addRow() {
    const newRow = ModelFactory.newEmptyItemUom();
    newRow.itemId = this.row.id;
    newRow.id = 0;
    // this.itemUomsData.push(newRow);
    const transaction = {
      // rows to add
      add: [newRow]
    };
    this.gridApi.applyTransaction(transaction);
  }

  exportTableData() {
    let dataToExport;
    this.dataProviderService.getAllItemUoms(this.row.id).subscribe(data => {
      if (data && data.length > 0) {
        dataToExport = data.map((row: any) => {
          delete row.uomId;
          delete row.itemId;
          return this.utilities.getJsonFromObject(row, IMPORTING_TYPES.ITEMUOMS);
        });
        this.utilities.exportToXlsx(dataToExport, 'Item Uoms List');
      }
    });
  }

  updateItemUom(event) {
    console.log(event);
    const itemUom = event.data;
    console.log('updateItemUom', itemUom);
    if (itemUom.id > 0) {
      itemUom.uom = this.itemData.uomsList.find((uom: any) => uom.id === itemUom.id);
      this.dataProviderService.updateItemUom(itemUom, itemUom.id).subscribe(result => {
        this.utilities.log('item uom update result', result);
        if (result) {
          this.utilities.showSnackBar('Item uom updated successfully', 'OK');
        }
      }, error => {
        this.utilities.error('Error on update item uom', error);
        this.utilities.showSnackBar('Error on update item uom', 'OK');
      });
    } else {
      this.dataProviderService.createItemUom(itemUom).subscribe(result => {
        this.utilities.log('item uom create result', result);
        if (result) {
          this.utilities.showSnackBar('Item uom created successfully', 'OK');
        }
      }, error => {
        this.utilities.error('Error on create item uom', error);
        this.utilities.showSnackBar('Error on create item uom', 'OK');
      });
    }
  }

  deleteItemUom(params: any) {
    this.utilities.log('edit-item. deleteItemUom params', params);
    if (params.rowData.id) {
      this.dataProviderService.deleteItemUom(params.rowData.id).subscribe(results => {
        this.utilities.log('delete item uom results', results);
        if (results) {
          this.utilities.showSnackBar('Item uom deleted successfully', 'OK');
          /*const index = this.itemUomsData.findIndex(itemuom => itemuom.id === params.rowData.id);
          if (index > -1) {
            this.itemUomsData.splice(index, 1);
          }*/
          const transaction = {
            // rows to remove
            remove: [params.rowData]
          };
          this.gridApi.applyTransaction(transaction);
        }
      }, error => {
        this.utilities.error('Error on delete item uom', error);
        this.utilities.showSnackBar('Error on delete item uom', 'OK');
      });
    } else {
      const transaction = {
        // rows to remove
        remove: [params.rowData]
      };
      this.gridApi.applyTransaction(transaction);
    }
  }

  startEditItemUom(params: any, rIndex: number, cKey: string) {
    this.utilities.log('startEditItemUom params', params);
    this.utilities.log('startEditItemUom rowIndex', rIndex);
    this.utilities.log('startEditItemUom colKey', cKey);
    this.gridApi.startEditingCell({rowIndex: rIndex, colKey: cKey});
  }

  finishEditItemUom(params: any) {
    this.utilities.log('edit-item. finishEditItemUom params', params);
    this.gridApi.stopEditing();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  rowOption(params) {
    // console.log('rowOptions', params);
    // this.utilities.log('sdsd');
  }
  /* fin de metodos para la tabla de item uoms */
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
        this.uomGetter = (params) => {
          console.log('uomGetter', params);
          const key = params.colDef.field;
          console.log('key', key);
          const value = params.data[key];
          let found;
          if (typeof value === 'number') {
            found = this.itemData.uomsList.find((uom: any) => uom.id === value);
          }
          if (typeof value === 'string') {
            found = this.itemData.uomsList.find((uom: any) => uom.name === value);
          }
          console.log('found', found);
          return found && found.name ? found.name : '-';
        };
        this.uomSetter = (params) => {
          console.log('uomSetter', params);
          const key = params.colDef.field;
          const value = params.newValue;
          console.log('key', key);
          console.log('newValue', value);
          let found;
          if (typeof value === 'number') {
            found = this.itemData.uomsList.find((uom: any) => uom.id === value);
          }
          if (typeof value === 'string') {
            found = this.itemData.uomsList.find((uom: any) => uom.name === value);
          }
          console.log('found', found);
          params.data[key] = found && found.id ? found.id : null;
          return true;
        };
        this.itemUomsColDefs[8].valueSetter = this.uomSetter;
        this.itemUomsColDefs[8].valueGetter = this.uomGetter;

        this.itemUomsColDefs[9].valueGetter = this.uomGetter;
        this.itemUomsColDefs[9].valueSetter = this.uomSetter;

        this.itemUomsColDefs[10].valueGetter = this.uomGetter;
        this.itemUomsColDefs[10].valueSetter = this.uomSetter;

        this.itemUomsColDefs[11].valueGetter = this.uomGetter;
        this.itemUomsColDefs[11].valueSetter = this.uomSetter;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
