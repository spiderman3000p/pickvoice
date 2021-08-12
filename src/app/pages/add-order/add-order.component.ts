import { OnDestroy, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Observer, Subscription } from 'rxjs';

import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { Location as WebLocation } from '@angular/common';

import { DataProviderService} from '../../services/data-provider.service';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { OrderType, Customer, UnityOfMeasure, QualityStates, OrderLine } from '@pickvoice/pickvoice-api';
import { AgGridAngular } from 'ag-grid-angular';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SearchTransportDialogComponent } from 'src/app/components/transport-selector-dialog/transport-selector-dialog.component';
import { SearchCustomerDialogComponent } from 'src/app/components/customer-selector-dialog/customer-selector-dialog.component';
import { EditRowDialogComponent } from 'src/app/components/edit-row-dialog/edit-row-dialog.component';
import { DateEditorComponent } from '../edit-order/date-editor.component';
import { NumericEditorComponent } from '../edit-item/numeric-editor.component';
import { RowOptionComponent } from '../edit-item/row-option.component';
import { SelectCellComponent } from '../edit-order/select-cell.component';
import { SelectCell2Component } from '../edit-order/select-cell2.component';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CellValueChangedEvent } from 'ag-grid-community';

class OrdersData {
  itemList: any[] = [];
  orderTypeList: OrderType[] = [];
  transportList: Transport[] = [];
  customerList: Customer[] = [];
  orderLineList: any[] = [];
  transportStatus: string[] = [];
  uomList: UnityOfMeasure[] = [];
  qualityStateList: QualityStates[] = [];
}
@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit, OnDestroy, AfterViewInit {
  definitions = ModelMap.OrderMap;
  form: FormGroup;
  row: any;
  selectedCustomer: any = {};
  selectedTransport: any = {};
  remoteSync: boolean;
  isLoadingResults = false;
  selectsData: any;
  dataSource: MatTableDataSource<OrderLine>;
  subscriptions: Subscription[] = [];
  dataMap = ModelMap.OrderMap;
  ordersData = new OrdersData();
  /* para ng-select */
  displayedDataColumns: string[] = [];
  displayedHeadersColumns: any[] = [];
  defaultColumnDefs: any[] = [];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  selection = new SelectionModel<OrderLine>(true, []);
  /* para tabla ag-grid */
  columnDefs: any[] = [];
  /* para tabla ag-grid */
  gridApi;
  gridColumnApi;
  frameworkComponents: any;
  itemGetter: any;
  itemSetter: any;
  qualityGetter: any;
  qualitySetter: any;
  orderLineColDefs: any[] = [
    {
      field: 'itemId',
      hide: true
    },
    {
      headerName: 'ITEM',
      field: 'item',
      width: 160,
      editable: true,
      resizable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      valueGetter: (params) => {
        //console.log('value getter', params.data);
        return params.data.item;
      },
      filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith'],
        textFormatter: (value) => {
          return value.itemSku ? `${value.itemSku} ${value.itemDescription}`.toLowerCase() : value.toLowerCase();
        },
        debounceMs: 0,
        suppressAndOrCondition: true,
        textCustomComparator: (filter, valueLowerCase, filterText) => {
          // console.log('value', valueLowerCase);
          let filterTextLowerCase = filterText.toLowerCase();
          //let valueLowerCase = `${value.itemSku} ${value.itemDescription}`.toLowerCase();
          // console.log('filter', filterTextLowerCase);
          switch (filter) {
              case 'contains':
                  return valueLowerCase.includes(filterTextLowerCase);
              case 'notContains':
                  return !valueLowerCase.includes(filterTextLowerCase);
              case 'startsWith':
                  return valueLowerCase.indexOf(filterTextLowerCase) === 0;
              case 'endsWith':
                  var index = valueLowerCase.lastIndexOf(filterTextLowerCase);
                  return index >= 0 && index === (valueLowerCase.length - filterTextLowerCase.length);
              default:
                  // should never happen
                  // console.warn('invalid filter type ' + filter);
                  return false;
              }
          }
      },
      cellRenderer: (params) => {
        return params.data?.itemSku && params.data?.itemDescription ? `[${params.data?.itemSku}] ${params.data?.itemDescription}` : ''
      },
      cellEditor: 'selectCellComponent',
      cellEditorParams: {
        options: (params) => this.dataProviderService.getAllItems(params),
        display: 'itemDescription',
        key: 'itemId',
        getUri: 'startRow=0;endRow=50;itemId-filterType=number;itemId-type=equals;itemId-filter=$;sort-itemId=asc',
        searchUri: `startRow=0;endRow=50;itemDescription-filterType=text;itemDescription-type=contains;itemDescription-filter=$;sort-itemSku=asc`
      }
    },
    {
      headerName: 'QUALITY',
      field: 'qualityState',
      width: 150,
      editable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      /*valueGetter: (params) => {
        console.log('value getter', params.data);
        return params.data.item;
      },*/
      filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith'],
        debounceMs: 0,
        suppressAndOrCondition: true,
        textCustomComparator: (filter, value, filterText) => {
          // console.log('value', value);
          let filterTextLowerCase = filterText.toLowerCase();
          const _quality = this.ordersData.qualityStateList.find(quality => quality.code == value.toUpperCase());
          if(!_quality) {
            return false;
          }
          const valueLowerCase = _quality.name.toLowerCase();
          // console.log('filter', filterTextLowerCase);
          switch (filter) {
            case 'contains':
                return valueLowerCase.includes(filterTextLowerCase);
            case 'notContains':
                return !valueLowerCase.includes(filterTextLowerCase);
            case 'startsWith':
                return valueLowerCase.indexOf(filterTextLowerCase) === 0;
            case 'endsWith':
                var index = valueLowerCase.lastIndexOf(filterTextLowerCase);
                return index >= 0 && index === (valueLowerCase.length - filterTextLowerCase.length);
            default:
                // should never happen
                // console.warn('invalid filter type ' + filter);
                return false;
            }
        }
      },
      cellRenderer: (params) => {
        const _quality = this.ordersData.qualityStateList.find(quality => quality.code == params.data.qualityState);
        return _quality ? _quality.name : '';
      },
      cellEditor: 'selectCell2Component',
      cellEditorParams: {
        options: () => this.ordersData.qualityStateList,
        display: 'name',
        key: 'code'
      }
    },
    {
      headerName: 'QTY',
      field: 'qtyRequired',
      width: 100,
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      cellEditor: 'numericEditor',
      editable: true,
      resizable: true
    },
    {
      headerName: 'BATCH NUMBER',
      field: 'batchNumber',
      width: 150,
      editable: true,
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      resizable: true
    },
    {
      headerName: 'EXPIRY DATE',
      field: 'expiryDate',
      width: 150,
      cellEditor: 'dateEditor',
      editable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        // provide comparator function
        comparator: function(filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            console.log('date value', dateAsString);
            console.log('filter date value', filterLocalDateAtMidnight.toLocaleDateString());
            if (dateAsString == null) {
                return 0;
            }

            // In the example application, dates are stored as dd/mm/yyyy
            // We create a Date object for comparison against the filter date
            var dateParts = dateAsString.split('-');
            var day = Number(dateParts[2]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[0]);
            var cellDate = new Date(year, month, day);
            console.log('new date parts', dateParts);
            console.log('new date', cellDate.toLocaleDateString());
            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            } else {
                return 0;
            }
        }
      },
      floatingFilter: true,
      resizable: true
    },
    {
      headerName: 'SERIAL',
      field: 'serial',
      width: 100,
      editable: true,
      filter: true,
      floatingFilter: true,
      resizable: true
    },
    {
      headerName: 'OPTIONS',
      field: 'options',
      pinned: 'right',
      cellRenderer: 'rowOption',
      width: 80,
      cellRendererParams: {
        deleteOrderLine: this.deletePrompt.bind(this),
        startEditOrderLine: this.startEditOrderLine.bind(this),
        finishEditOrderLine: this.finishEditOrderLine.bind(this),
      }
    }
  ];
  orderLinesData = [];
  @ViewChild('agGrid') agGrid: AgGridAngular;
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
    private utilities: UtilitiesService, private router: Router, private dialog: MatDialog,
    private location: WebLocation, private dataProviderService: DataProviderService,
    private sharedDataService: SharedDataService
  ) {
    const formControls = {};
    this.row = ModelFactory.newEmptyOrder();
    this.dataSource = new MatTableDataSource([]);
    this.form = new FormGroup({
      orderNumber: new FormControl(null),
      purchaseNumber: new FormControl(null),
      invoiceNumber: new FormControl(null),
      orderDate: new FormControl(null),
      deliveryDate: new FormControl(null),
      orderTypeId: new FormControl(null),
      priority: new FormControl(null),
      note: new FormControl(null),
      transportId: new FormControl(null),
      customerId: new FormControl(null),
      price: new FormControl(null)
    });
    this.form.get('transportId').valueChanges.subscribe(value => {
      this.row.transportId = value;
      this.getTransportDetails();
    });
    this.form.get('customerId').valueChanges.subscribe(value => {
      this.row.customerId = value;
      this.getCustomerDetails();
    });
    /* para tabla ag-grid */
    this.frameworkComponents = {
      dateEditor: DateEditorComponent,
      rowOption: RowOptionComponent,
      numericEditor: NumericEditorComponent,
      selectCellComponent: SelectCellComponent,
      selectCell2Component: SelectCell2Component
    };
    this.utilities.log('form', this.form.value);
  }
  addNewObject(key: string, objectType: string, myTitle: string) {
    this.utilities.log('map to send to add dialog', this.utilities.dataTypesModelMaps[objectType]);
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
        this.selectsData[key] = this.dataProviderService.getDataFromApi(key);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  ngAfterViewInit() {
  }

  onSubmit() {
    /*if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    this.utilities.log('toUpload', toUpload);
    for (const key in toUpload) {
      if (formData[key] !== undefined) {
        toUpload[key] = formData[key];
      }
    }
    this.utilities.log('toUpload after', toUpload);
    this.isLoadingResults = true;
    const observer = {
      next: (response) => {
        this.isLoadingResults = false;
        this.utilities.log('create response', response);
        if (response && (response.id)) {
          this.utilities.showSnackBar('Create Successfull', 'OK');
          this.router.navigate(['/pages/orders']);
        } else {
          this.utilities.showSnackBar('Unknown Error on create order', 'OK');
        }
      },
      error: (error) => {
        this.isLoadingResults = false;
        this.utilities.showSnackBar('Error on create request', 'OK');
        this.utilities.error('error on create', error);
      }
    };
    this.utilities.log('data to upload', toUpload);
    this.subscriptions.push(this.dataProviderService.createOrder(toUpload, this.row.id)
    .subscribe(observer));*/
    if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    if(this.row.transportId === 0){
      this.utilities.error('transporte invalido');
      this.utilities.showSnackBar('Please check the transport field', 'OK');
      return;
    }
    if(!this.row.customerId){
      this.utilities.error('customer invalido');
      this.utilities.showSnackBar('Please check the customer field', 'OK');
      return;
    }
    const formData = this.form.value;
    formData.orderLines = [];
    this.gridApi?.forEachNode((node) => {
      formData.orderLines.push(node.data);
    });
    this.utilities.log('orderlines', formData.orderLines);
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
      if(!toUpload.id){
        const createObserver = {
          next: (response) => {
            this.isLoadingResults = false;
            this.utilities.log('create response', response);
            if (response.id) {
              this.row.id = response.id;
              this.utilities.showSnackBar('Create Successfull', 'OK');
              this.itemGetter = (params) => {
                console.log('itemGetter', params);
                const key = params.colDef.field;
                console.log('key', key);
                const value = params.data[key];
                let found;
                if (typeof value === 'number') {
                  found = this.ordersData.itemList.find((item: any) => item.itemId === value);
                }
                if (typeof value === 'string') {
                  found = this.ordersData.itemList.find((item: any) => item.itemDescription === value);
                }
                console.log('found', found);
                return found && found.itemDescription ? found.itemDescription : '-';
              };
              this.itemSetter = (params) => {
                console.log('itemSetter', params);
                const key = params.colDef.field;
                const value = params.newValue;
                console.log('key', key);
                console.log('newValue', value);
                let found;
                if (typeof value === 'number') {
                  found = this.ordersData.itemList.find((item: any) => item.itemId === value);
                }
                if (typeof value === 'string') {
                  found = this.ordersData.itemList.find((item: any) => item.itemDescription === value);
                }
                console.log('found', found);
                params.data[key] = found && found.itemId ? found.itemId : null;
                return true;
              };
              this.qualityGetter = (params) => {
                console.log('qualityGetter', params);
                const key = params.colDef.field;
                console.log('key', key);
                const value = params.data[key];
                let found;
                if (typeof value === 'number') {
                  found = this.ordersData.qualityStateList.find((item: any) => item.id === value);
                }
                if (typeof value === 'string') {
                  found = this.ordersData.qualityStateList.find((item: any) => item.name === value);
                }
                console.log('found', found);
                return found && found.name ? found.name : '-';
              };
              this.qualitySetter = (params) => {
                console.log('itemSetter', params);
                const key = params.colDef.field;
                const value = params.newValue;
                console.log('key', key);
                console.log('newValue', value);
                let found;
                if (typeof value === 'number') {
                  found = this.ordersData.qualityStateList.find((item: any) => item.id === value);
                }
                if (typeof value === 'string') {
                  found = this.ordersData.qualityStateList.find((item: any) => item.name === value);
                }
                console.log('found', found);
                params.data[key] = found && found.id ? found.id : null;
                return true;
              };
              this.orderLineColDefs[1].valueSetter = this.itemSetter;
              this.orderLineColDefs[1].valueGetter = this.itemGetter;
              this.orderLineColDefs[2].valueGetter = this.qualityGetter;
              this.orderLineColDefs[2].valueSetter = this.qualitySetter;
              this.init()
            }
            // this.back();
          },
          error: (error) => {
            this.isLoadingResults = false;
            this.utilities.showSnackBar('Error on create row request', 'OK');
            this.utilities.error('error on create', error);
          }
        };
        this.dataProviderService.createOrder(toUpload).subscribe(createObserver)
      } else {
        const updateObserver = {
          next: (response) => {
            this.isLoadingResults = false;
            this.utilities.log('update response', response);
            if ((response.status === 204 || response.status === 200 || response.status === 201)
              && response.statusText === 'OK') {
              this.utilities.showSnackBar('Update Successfull', 'OK');
            } else {
              this.utilities.showSnackBar('Error on Update', 'OK');
            }
          },
          error: (error) => {
            this.isLoadingResults = false;
            this.utilities.showSnackBar('Error on update request', 'OK');
            this.utilities.error('error on update', error);
          }
        };
        this.dataProviderService.updateOrder(toUpload, toUpload.id).subscribe(updateObserver)
      }
    } else {
      this.sharedDataService.returnData = toUpload;
      this.location.back();
    }
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    /*this.isLoadingResults = true;
    this.activatedRoute.data.subscribe((data: {
      data: any
    }) => {
      this.isLoadingResults = false;
      console.log('data', data.data);
      this.selectsData = {};
      if (data.data) {
        this.selectsData.orderTypes = data.data.orderTypes;
        this.selectsData.transports = data.data.transports;
        this.selectsData.customers = data.data.customers;
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error fetching data. check Internet conection');
      this.utilities.showSnackBar('Error fetching data', 'OK');
    });*/
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.remoteSync = true;
    this.getBaseData()
  }

  getOrderTypeList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.ORDER_TYPE).subscribe(results => {
      this.ordersData.orderTypeList = results;
      this.utilities.log('this.ordersData.orderTypeList', this.ordersData.orderTypeList);
    });
  }

  getOrderLineList() {
    this.dataProviderService.getAllOrderLinesForOrder(this.row.id).subscribe((results: any) => {
      this.ordersData.orderLineList = results;
      this.ordersData.orderLineList.forEach((orderLine, index) => {
        orderLine.item = {};
        this.subscriptions.push(
          this.dataProviderService.getAllItems(`startRow=0;endRow=1;itemId-filterType=number;itemId-type=equals;itemId-filter=${orderLine.itemId};sort-itemDescription=asc`).subscribe((result: any) => {
            if(result && result.content && result.content.length > 0) {
              orderLine.item = result.content[0];
              this.gridApi.applyTransaction({ update: [orderLine]});
            }
          })
        );
        /*if (index === this.ordersData.orderLineList.length -1) {
          this.gridApi.redrawRows();
        }*/
      });
      this.utilities.log('this.ordersData.orderLineList', this.ordersData.orderLineList);
    });
  }

  getCustomerList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.CUSTOMERS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.customerList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.customerList = results;
      }
      this.utilities.log('this.ordersData.customerList', this.ordersData.customerList);
    });
  }

  getTransportList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.TRANSPORTS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.transportList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.transportList = results;
      }
      this.utilities.log('this.ordersData.transportList', this.ordersData.transportList);
    });
  }

  getItemList() {
    this.dataProviderService.getAllItems('startRow=0;endRow=100000').subscribe((results: any) => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.itemList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.itemList = results;
      }
      if (this.ordersData.itemList.length > 0) {
        this.gridApi.redrawRows();
      }
      this.utilities.log('this.ordersData.itemList', this.ordersData.itemList);
    });
  }

  getQualityStateList() {
    this.dataProviderService.getAllQualityStates().subscribe((results: any) => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.qualityStateList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.qualityStateList = results;
      }
      this.utilities.log('this.ordersData.qualityStateList', this.ordersData.qualityStateList);
    });
  }

  getUomList() {
    this.dataProviderService.getDataFromApi(IMPORTING_TYPES.UOMS).subscribe(results => {
      if (results && results.content && Array.isArray(results.content)) {
        this.ordersData.uomList = results.content;
      } else if (results && Array.isArray(results)) {
        this.ordersData.uomList = results;
      }
      this.utilities.log('this.ordersData.uomList', this.ordersData.uomList);
    });
  }

  getTransportStatusList() {
    this.dataProviderService
    .getDataFromApi(IMPORTING_TYPES.TRANSPORT_STATE).subscribe(results => {
      this.ordersData.transportStatus = results;
    });
  }

  deletePrompt(params: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteOrderLine(params);
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

  startEditOrderLine(params: any, rIndex: number, cKey: string) {
    this.gridApi.startEditingCell({rowIndex: rIndex, colKey: cKey});
  }

  finishEditOrderLine(params: any) {
    this.utilities.log('edit-order. finishEditOrderLine params', params);
    this.gridApi.stopEditing();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  deleteOrderLine(params: any) {
    const transaction = {
      // rows to remove
      remove: [params.rowData]
    };
    this.gridApi.applyTransaction(transaction);
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getBaseData(){
    // this.getItemList();
    this.getQualityStateList();
    this.getTransportList();
    this.getCustomerList();
    this.getOrderTypeList();
    this.getUomList();
    if(this.row.id > 0){
      this.getOrderLineList();
    }
    this.getTransportStatusList();
  }

  init() {
    this.utilities.log('order', this.row);
    this.form.get('transportId').patchValue(this.row.transportId);
    this.form.get('customerId').patchValue(this.row.customerId);
    // inicializamos todo lo necesario para la tabla
    if (this.row) {
      this.dataSource.data = this.ordersData.orderLineList;
      // inicializar tabla mat-table
      this.displayedDataColumns = Object.keys(this.definitions);
      this.displayedHeadersColumns = ['select'].concat(Object.keys(this.definitions));
      this.displayedHeadersColumns.push('options');
      this.initColumnsDefs(); // columnas a mostrarse en la tabla
    }
    this.form = new FormGroup({
      orderNumber: new FormControl(this.row.orderNumber ? this.row.orderNumber : null, Validators.required),
      purchaseNumber: new FormControl(this.row.purchaseNumber ? this.row.purchaseNumber : null),
      invoiceNumber: new FormControl(this.row.invoiceNumber ? this.row.invoiceNumber : null),
      orderDate: new FormControl(this.row.orderDate ? this.row.orderDate : null),
      deliveryDate: new FormControl(this.row.deliveryDate ? this.row.deliveryDate : null),
      orderTypeId: new FormControl(this.row.orderTypeId ? this.row.orderTypeId : null),
      priority: new FormControl(this.row.priority ? this.row.priority : null),
      note: new FormControl(this.row.note ? this.row.note : null),
      // idTransport: new FormControl(this.row.idTransport),
      transportId: new FormControl(this.row.transportId ? this.row.transportId : null),
      customerId: new FormControl(this.row.customerId ? this.row.customerId : null),
      price: new FormControl(this.row.price ? this.row.price : null)

    });
    this.form.get('transportId').valueChanges.subscribe(value => {
      this.row.transportId = value;
      this.getTransportDetails();
    });
    this.form.get('customerId').valueChanges.subscribe(value => {
      this.row.customerId = value;
      this.getCustomerDetails();
    });
    this.form.get('customerId').patchValue(this.row.customerId ? this.row.customerId : null);
    this.form.get('transportId').patchValue(this.row.transportId ? this.row.transportId : null);
    this.utilities.log('form value', this.form.value);
  }

  initColumnsDefs() {
    let shouldShow: boolean;
    let filter: any;
    const formControls = {} as any;
    let aux;
    if (localStorage.getItem('displayedColumnsInOrderLinesPage')) {
      this.columnDefs = JSON.parse(localStorage.getItem('displayedColumnsInOrderLinesPage'));
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
    this.utilities.log('columnDefs ', this.columnDefs);
    this.utilities.log('defaultColumnDefs ', this.defaultColumnDefs);

    this.columnDefs.forEach((column, index) => {
      // ignoramos la columna 0 y la ultima (select y opciones)
      if (index > 0 && index < this.columnDefs.length - 1) {
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
    localStorage.setItem('displayedColumnsInOrderLinesPage', JSON.stringify(this.columnDefs));
    // this.utilities.log('displayed column after', this.columnDefs);
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
    // this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selection.selected.length > 0) {
          this.deleteOrderLinePrompt(this.selection.selected);
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
        // TODO: tener servicio para eliminar registros de orderLines
        // this.orderService.deleteOrderLine(row.id, 'response', false).subscribe(observer);
        this.deleteOrderLine(row);
      });
    } else {
      this.deleteOrderLine(rows);
    }
  }

  deleteOrderLinePrompt(rows?: any) {
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

  sortOrderLines(col = 'itemId', sort = 'asc') {
    const sortModel = [{
      colId: col,
      sort: sort
    }];
    setTimeout(() => {
      this.gridApi.setSortModel(sortModel);
    }, 500);
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

  editOrderLineOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editOrderLineOnDialog(element: any, mode: string) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: this.definitions,
        viewMode: mode,
        type: IMPORTING_TYPES.ORDER_LINE,
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
    });
  }

  openSearchCustomerDialog() {
    const dialogRef = this.dialog.open(SearchCustomerDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.form.get('customerId').setValue(result.customerId);
        this.selectedCustomer = result;
      }
    }, error => {
      this.utilities.error('error after closing search customer dialog', error);
      this.utilities.showSnackBar('Error after closing search customer dialog', 'OK');
    });
  }

  openSearchTransportDialog() {
    const dialogRef = this.dialog.open(SearchTransportDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.form.get('transportId').setValue(result.transportId);
        this.selectedTransport = result;
      }
    }, error => {
      this.utilities.error('error after closing search transport dialog', error);
      this.utilities.showSnackBar('Error after closing search transport dialog', 'OK');
    });
  }

  addOrderLine() {
    const newRow = ModelFactory.newEmptyOrderLine();
    newRow.idOrder = this.row.id;
    // this.itemUomsData.push(newRow);
    const transaction = {
      // rows to add
      add: [newRow]
    };
    this.gridApi.applyTransaction(transaction);
  }

  updateOrderLine(event: CellValueChangedEvent) {
    console.log('order line updated event', event)
    const orderLine = event.newValue
    console.log('order line updated', orderLine)
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = Object.assign({}, this.row);
    delete dataToExport.id;
    delete dataToExport.ownerId;
    this.utilities.exportToXlsx(dataToExport, 'Order ' + this.row.orderNumber);
  }

  exportOrderLines() {
    const dataToExport = this.dataSource.data.slice().map((row: any) => {
      delete row.orderId;
      return row;
    });
    this.utilities.exportToXlsx(dataToExport, 'Order Lines List');
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

  getCustomerDetails() {
    if (this.row.customerId) {
      this.dataProviderService.getCustomer(this.row.customerId).subscribe(results => {
        this.selectedCustomer = results;
        this.utilities.log('selected customer details: ', this.selectedCustomer);
      });
    }
  }

  getTransportDetails() {
    if (this.row.transportId) {
      this.dataProviderService.getTransport(this.row.transportId).subscribe(results => {
        this.selectedTransport = results;
        this.utilities.log('selected transport details: ', this.selectedTransport);
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
