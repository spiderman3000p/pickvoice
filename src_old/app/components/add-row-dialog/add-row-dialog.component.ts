import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService,
         ItemTypeService, OrderService, Customer, OrderLine, Section, UomService, SectionService,
         OrderType, Transport } from '@pickvoice/pickvoice-api';
import { DataStorage } from '../../services/data-provider';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ModelFactory } from '../../models/model-factory.class';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

interface ItemsData {
  itemTypeList: Observable<ItemType[]>;
  unityOfMeasureList: Observable<UnityOfMeasure[]>;
}

interface LocationsData {
  sectionList: Observable<Section[]>;
  typeList: Observable<string[]>;
}

interface OrdersData {
  orderTypeList: Observable<OrderType[]>;
  transportList: Observable<Transport[]>;
  customerList: Observable<Customer[]>;
}

@Component({
  selector: 'app-add-row-dialog',
  templateUrl: './add-row-dialog.component.html',
  styleUrls: ['./add-row-dialog.component.scss']
})

export class AddRowDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any; // Item | Location | Order | ItemType | UnityOfMeasure
  isLoadingResults = false;
  itemsData: ItemsData; // para los datos compuestos de Item
  locationsData: LocationsData; // para los datos compuestos de Location
  ordersData: OrdersData;
  constructor(public dialogRef: MatDialogRef<AddRowDialogComponent>, private dataProvider: DataStorage,
              private itemService: ItemsService, private locationService: LocationsService,
              private orderService: OrderService, private itemTypeService: ItemTypeService,
              private uomService: UomService, private sectionService: SectionService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // init variables
    this.itemsData = new Object() as ItemsData;
    this.locationsData = new Object() as LocationsData;
    this.ordersData = new Object() as OrdersData;
    this.dataMap = data.map; // map of object
    this.utilities.log('fields', this.dataMap);
    this.type = data.type; // map of object
    this.utilities.log('type', this.type);
    this.remoteSync = data.remoteSync; // map of object
    this.utilities.log('remoteSync', this.remoteSync);
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    this.utilities.log('keys', this.keys);
    let value: any;
    if (this.type === IMPORTING_TYPES.ITEMS) {
      this.row = ModelFactory.newEmptyItem();
      this.utilities.log('new empty item', this.row);
      this.getItemTypeList();
      this.getUnityOfMeasureList();
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      this.row = ModelFactory.newEmptyLocation();
      this.utilities.log('new empty location', this.row);
      this.getSectionList();
      this.getTypeList();
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      this.row = ModelFactory.newEmptyOrder();
      this.utilities.log('new empty order', this.row);
      this.getTransportList();
      this.getCustomerList();
      this.getOrderTypeList();
    }
    if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
      this.row = ModelFactory.newEmptyItemType();
      this.utilities.log('new empty item type', this.row);
    }
    if (this.type === IMPORTING_TYPES.UOMS) {
      this.row = ModelFactory.newEmptyUnityOfMeasure();
      this.utilities.log('new empty uom', this.row);
    }
    // init variables end

    this.utilities.log('row recibida', this.row);

    // build form group
    this.keys.forEach((key, index) => {
      if (this.row === undefined) {
        return;
      }
      value = this.utilities.renderColumnData(this.dataMap[key].type, this.row[key]);
      if (this.dataMap[key].required) {
        formControls[key] = new FormControl(value, Validators.required);
      } else {
        formControls[key] = new FormControl(value);
      }
    });
    console.log('form controls', formControls);
    this.dialogTitle = 'Add Row';
    this.form = new FormGroup(formControls);
  }

  getSectionList() {
    this.locationsData.sectionList = this.sectionService.retrieveAllSections();
    /*this.locationsData.sectionList = new Observable(suscriber => {
      const sectionList = [
        new Object({code: 'MEZ1', name: 'Mezanine', description: 'string'}) as Section,
        new Object({code: 'MEZ1', name: 'Mezanine', description: 'string'}) as Section
      ];
      suscriber.next(sectionList);
      suscriber.complete();
    });*/
  }

  getTypeList() {
    const types: string[] = [];
    this.locationsData.typeList = new Observable(suscriber => {
      for (const key in Location.TypeEnum) {
        if (1) {
          types.push(key);
        }
      }
      suscriber.next(types);
      suscriber.complete();
    });
    // this.locationsData.typeList.subscribe(result => console.log('type result', result));
  }

  getItemTypeList() {
    this.itemsData.itemTypeList = this.itemTypeService.retrieveAllItemTypes();
  }

  getUnityOfMeasureList() {
    this.itemsData.unityOfMeasureList = this.uomService.retrieveAllUom();
  }

  getOrderTypeList() {
    // this.ordersData.orderTypeList = this.orderTypeService.retrieveAll();
    this.ordersData.orderTypeList = new Observable(suscriber => {
      suscriber.next([
        { code: 'Factura', description: 'Factura'}
      ]);
      suscriber.complete();
    });
  }

  getCustomerList() {
    // this.ordersData.orderTypeList = this.orderTypeService.retrieveAll();
    this.ordersData.customerList = new Observable(suscriber => {
      suscriber.next([
        { customerNumber: 'CU01', name: 'CUSTOMER 1', contact: '', phone: '', address: ''},
        { customerNumber: 'CU02', name: 'CUSTOMER 2', contact: '', phone: '', address: ''},
      ]);
      suscriber.complete();
    });
  }

  getTransportList() {
    // this.ordersData.orderTypeList = this.orderTypeService.retrieveAll();
    this.ordersData.transportList = new Observable(suscriber => {
      suscriber.next([
        { transportNumber: 'T01', route: 'ROUTE 1', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T01', transportState: Transport.TransportStateEnum.Pending
        },
        { transportNumber: 'T01', route: 'ROUTE 2', nameRoute: 'ROUTE 02', dispatchPlatforms: '',
          carrierCode: 'T02', transportState: Transport.TransportStateEnum.Pending
        }
      ]);
      suscriber.complete();
    });
  }

  getSelectDisplayData(data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (typeof data === 'object' ?
    (data[this.dataMap[key].formControl.displayIndex] ? data[this.dataMap[key].formControl.displayIndex] : '-') :
    (typeof data === 'string' ?
    (data ? data : '-') : '-'));
  }

  getSelectInputData(key: string): Observable<any[]> {
    let data: Observable<any[]>;
    if (this.type === IMPORTING_TYPES.ITEMS) {
      switch (key) {
        case 'itemType': data = this.itemsData.itemTypeList; break;
        case 'uom': data = this.itemsData.unityOfMeasureList; break;
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
    // data.subscribe(result => console.log('data on select', result));
    // console.log(`getSelectInputData: key = '${key}', data:`, data);
    return data;
  }

  onSubmit() {
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    this.utilities.log('row data', toUpload);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      // Necesitamos guardar los cambios en el objeto recibido
      for (let key in formData) {
        if (1) {
          this.utilities.log(`key ${key}`);
          this.utilities.log(`toUpload[${key}]`, toUpload[key]);
          this.utilities.log(`formData[${key}]`, formData[key]);

          toUpload[key] = formData[key];

          this.utilities.log(`toUpload`, toUpload);
        }
      }
      this.utilities.log('data to upload', toUpload);
      const observer = {
        next: (response) => {
          this.isLoadingResults = false;
          this.utilities.log('create response', response);
          if ((response.status === 204 || response.status === 200 || response.status === 201)
            && response.statusText === 'OK') {
            this.utilities.showSnackBar('Create Successfull', 'OK');
          }
          this.dialogRef.close(response.body);
        },
        error: (error) => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on create row request', 'OK');
          this.utilities.error('error on create', error);
        }
      };
      if (this.type === IMPORTING_TYPES.ITEMS) {
        this.itemService.createItem(toUpload, 'response', false).pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.locationService.createLocation(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.orderService.createOrder(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.itemTypeService.createItemType(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.uomService.createUom(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }
    } else {
      this.dialogRef.close(toUpload);
    }
  }

  ngOnInit(): void {
  }

}
