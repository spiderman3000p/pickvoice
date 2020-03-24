import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService, Transport,
         ItemTypeService, OrderService, Customer, OrderLine, OrderTypeService, OrderType, UomService,
         Section, SectionService, CustomerService } from '@pickvoice/pickvoice-api';
import { AddRowDialogComponent } from '../add-row-dialog/add-row-dialog.component';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { DataStorage } from '../../services/data-provider';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

interface ItemsData {
  itemTypeList: ItemType[];
  unityOfMeasureList: UnityOfMeasure[];
  itemStateList: string[];
}

interface LocationsData {
  sectionList: Section[];
  typeList: string[];
}

interface OrderLinesData {
  ordersList: Order[];
  itemsList: Item[];
}

interface OrdersData {
  orderTypeList: OrderType[];
  transportList: Transport[];
  customerList: Customer[];
}

interface TransportsData {
  transportStateList: string[];
}
@Component({
  selector: 'app-edit-row-dialog',
  templateUrl: './edit-row-dialog.component.html',
  styleUrls: ['./edit-row-dialog.component.scss']
})

export class EditRowDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any;
  isLoadingResults = false;
  viewMode: string;
  itemsData: ItemsData; // para los datos compuestos de Item
  locationsData: LocationsData; // para los datos compuestos de Location
  ordersData: OrdersData;
  orderLinesData: OrderLinesData;
  transportsData: TransportsData;
  constructor(public dialogRef: MatDialogRef<EditRowDialogComponent>, private dataProvider: DataStorage,
              private itemService: ItemsService, private locationService: LocationsService,
              private orderService: OrderService, private itemTypeService: ItemTypeService,
              private sectionService: SectionService, private orderTypeService: OrderTypeService,
              private uomService: UomService, private customerService: CustomerService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    this.row = data.row; // object
    this.utilities.log('row recibida', this.row);

    this.itemsData = new Object() as ItemsData;
    this.locationsData = new Object() as LocationsData;
    this.ordersData = new Object() as OrdersData;
    this.orderLinesData = new Object() as OrderLinesData;
    this.transportsData = new Object() as TransportsData;

    this.dataMap = data.map; // map of object
    this.utilities.log('fields', this.dataMap);
    this.type = data.type; // map of object
    this.utilities.log('type', this.type);
    this.remoteSync = data.remoteSync; // map of object
    this.utilities.log('remoteSync', this.remoteSync);
    this.viewMode = data.viewMode;
    this.utilities.log('viewMode', this.viewMode);
    this.dialogTitle = this.viewMode === 'edit' ? 'Edit Row' : 'View Row';
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    this.utilities.log('keys', this.keys);
    let value = '';
    this.utilities.log('data type', this.type);
    this.keys.forEach((key, index) => {
      if (this.row === undefined) {
        return;
      }
      // value = this.utilities.renderColumnData(this.dataMap[key].type, this.row[key]);
      if (this.dataMap[key].required) {
        formControls[key] = new FormControl(this.row[key], Validators.required);
      } else {
        formControls[key] = new FormControl(this.row[key]);
      }
    });
    this.form = new FormGroup(formControls);
    if (this.type === IMPORTING_TYPES.ITEMS) {
      this.getItemTypeList();
      this.getUnityOfMeasureList();
      this.getItemStateList();
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      this.getSectionList();
      this.getTypeList();
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      this.getTransportList();
      this.getCustomerList();
      this.getOrderTypeList();
    }
    if (this.type === IMPORTING_TYPES.ORDER_LINE) {
      this.getItemsList();
      this.getOrdersList();
    }
    if (this.type === IMPORTING_TYPES.TRANSPORTS) {
      this.getTransportStateList();
    }
  }

  addNewObject(objectType: string, myTitle: string) {
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
        if (objectType === IMPORTING_TYPES.ITEM_TYPE) {
          this.itemsData.itemTypeList.push(result);
        }
        if (objectType === IMPORTING_TYPES.UOMS) {
          this.itemsData.unityOfMeasureList.push(result);
        }
        if (objectType === IMPORTING_TYPES.SECTIONS) {
          this.locationsData.sectionList.push(result);
        }
        if (objectType === IMPORTING_TYPES.TRANSPORTS) {
          this.ordersData.transportList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ORDER_TYPE) {
          this.ordersData.orderTypeList.push(result);
        }
        if (objectType === IMPORTING_TYPES.CUSTOMERS) {
          this.ordersData.customerList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ITEMS) {
          this.orderLinesData.itemsList.push(result);
        }
        if (objectType === IMPORTING_TYPES.ORDERS) {
          this.orderLinesData.ordersList.push(result);
        }
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  getItemsList() {
    this.itemService.retrieveAllItems().subscribe(results => {
      this.orderLinesData.itemsList = results;
    });
  }

  getOrdersList() {
    this.orderService.retrieveAllOrders().subscribe(results => {
      this.orderLinesData.ordersList = results;
    });
  }

  getSectionList() {
    this.sectionService.retrieveAllSections().subscribe(results => {
      this.locationsData.sectionList = results;
    });
  }

  getTransportStateList() {
    this.transportsData.transportStateList = Object.keys(Transport.TransportStateEnum);
  }

  getTypeList() {
    this.locationsData.typeList = Object.keys(Location.TypeEnum);
  }

  getItemStateList() {
    this.itemsData.itemStateList = Object.keys(Item.ItemStateEnum);
}

  getItemTypeList() {
    this.itemTypeService.retrieveAllItemTypes().subscribe(results => {
      this.itemsData.itemTypeList = results;
    });
  }

  getUnityOfMeasureList() {
    this.uomService.retrieveAllUom().subscribe(results => {
      this.itemsData.unityOfMeasureList = results;
    });
  }

  getOrderTypeList() {
    this.orderTypeService.retrieveAllOrderType().subscribe(results => {
      this.ordersData.orderTypeList = results;
    });
  }

  getCustomerList() {
    this.customerService.retrieveAllCustomers().subscribe(results => {
      this.ordersData.customerList = results;
    });
  }

  getTransportList() {
    // this.ordersData.orderTypeList = this.orderTypeService.retrieveAll();
    const obs = new Observable<Transport[]>(suscriber => {
      suscriber.next([
        { transportNumber: 'T01', route: 'ROUTE 1', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T01', transportState: Transport.TransportStateEnum.Pending
        },
        { transportNumber: 'T01', route: 'ROUTE 2', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T02', transportState: Transport.TransportStateEnum.Pending
        }
      ]);
      suscriber.complete();
    }).subscribe(results => {
      this.ordersData.transportList = results;
    });
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
    for (const key in toUpload) {
      if (formData[key]) {
        toUpload[key] = formData[key];
      }
    }
    // si esta activada la opcion de sincronizacion remota, se envian los datos a la api
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
          this.dialogRef.close(toUpload);
        },
        error: (error) => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on edit row request', 'OK');
          this.utilities.error('error on update', error);
        }
      };
      this.utilities.log('data to upload', toUpload);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        this.itemService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.locationService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS_DTO) {
        this.orderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.itemTypeService.updateItemType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.orderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.orderTypeService.updateorderType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }
    } else {
      this.dialogRef.close(toUpload);
    }
  }

  getSelectIndexValue(data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (typeof data === 'object' ?
    (data[this.dataMap[key].formControl.valueIndex] ? data[this.dataMap[key].formControl.valueIndex] : '-') :
    (typeof data === 'string' ?
    (data ? data : '-') : '-'));
  }

  getSelectDisplayData(data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (typeof data === 'object' ?
    (data[this.dataMap[key].formControl.displayIndex] ? data[this.dataMap[key].formControl.displayIndex] : '-') :
    (typeof data === 'string' ?
    (data ? data : '-') : '-'));
  }

  getSelectInputData(key: string): any[] {
    let data: any[];
    if (this.type === IMPORTING_TYPES.ITEMS) {
      switch (key) {
        case 'itemType': data = this.itemsData.itemTypeList; break;
        case 'uom': data = this.itemsData.unityOfMeasureList; break;
        case 'itemState': data = this.itemsData.itemStateList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      switch (key) {
        case 'section': data = this.locationsData.sectionList; break;
        case 'type': data = this.locationsData.typeList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      switch (key) {
        case 'orderType': data = this.ordersData.orderTypeList; break;
        case 'transport': data = this.ordersData.transportList; break;
        case 'customer': data = this.ordersData.customerList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.ORDER_LINE) {
      switch (key) {
        case 'item': data = this.orderLinesData.itemsList; break;
        case 'order': data = this.orderLinesData.ordersList; break;
        default: break;
      }
    }
    if (this.type === IMPORTING_TYPES.TRANSPORTS) {
      switch (key) {
        case 'transportState': data = this.transportsData.transportStateList; break;
        default: break;
      }
    }
    // data.subscribe(result => console.log('data on select', result));
    // console.log(`getSelectInputData: key = '${key}', data:`, data);
    return data;
  }

  getColumnsClasses() {
    let classes = 'col-sm-12 col-md-4 col-lg-3';
    if (this.keys.length > 1) {
      classes = 'col-sm-12 col-md-6 col-lg-6';
    }
    if (this.keys.length >= 3) {
      classes = 'col-sm-12 col-md-4 col-lg-4';
    }
    if (this.keys.length >= 5) {
      classes = 'col-sm-12 col-md-4 col-lg-3';
    }
    return classes;
  }

  ngOnInit(): void {
  }

}
