import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService, CustomerService,
         ItemTypeService, OrderService, Customer, OrderLine, Section, UomService, SectionService,
         OrderType, Transport, OrderTypeService } from '@pickvoice/pickvoice-api';
import { DataStorage } from '../../services/data-provider';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ModelFactory } from '../../models/model-factory.class';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

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
  orderLinesData: OrderLinesData;
  transportsData: TransportsData;
  constructor(public dialogRef: MatDialogRef<AddRowDialogComponent>, private dataProvider: DataStorage,
              private itemService: ItemsService, private locationService: LocationsService,
              private orderService: OrderService, private itemTypeService: ItemTypeService,
              private uomService: UomService, private sectionService: SectionService,
              private customerService: CustomerService, private orderTypeService: OrderTypeService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // init variables
    this.itemsData = new Object() as ItemsData;
    this.locationsData = new Object() as LocationsData;
    this.ordersData = new Object() as OrdersData;
    this.orderLinesData = new Object() as OrderLinesData;
    this.transportsData = new Object() as TransportsData;
    this.dataMap = data.map; // map of object
    this.utilities.log('fields', this.dataMap);
    this.type = data.type;
    this.utilities.log('type', this.type);
    this.dialogTitle = data.title;
    this.utilities.log('title', this.dialogTitle);
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
      this.getItemStateList();
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
    if (this.type === IMPORTING_TYPES.CUSTOMERS) {
      this.row = ModelFactory.newEmptyCustomer();
      this.utilities.log('new empty customer', this.row);
    }
    if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
      this.row = ModelFactory.newEmptyOrderType();
      this.utilities.log('new empty order type', this.row);
    }
    if (this.type === IMPORTING_TYPES.ORDER_LINE) {
      this.row = ModelFactory.newEmptyOrderLine();
      this.utilities.log('new empty order line', this.row);
      this.getItemsList();
      this.getOrdersList();
    }
    if (this.type === IMPORTING_TYPES.SECTIONS) {
      this.row = ModelFactory.newEmptySection();
      this.utilities.log('new empty section', this.row);
    }
    if (this.type === IMPORTING_TYPES.TRANSPORTS) {
      this.row = ModelFactory.newEmptyTransport();
      this.getTransportStateList();
      this.utilities.log('new empty transport', this.row);
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
    // console.log('form controls', formControls);
    this.form = new FormGroup(formControls);
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
    this.utilities.log('row data', toUpload);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      // Necesitamos guardar los cambios en el objeto recibido
      for (let key in formData) {
        if (1) {
          this.utilities.log(`key ${key}`);
          this.utilities.log(`toUpload[${key}]`, toUpload[key]);
          this.utilities.log(`formData[${key}]`, formData[key]);
          // transformar fechas al formato esperado D/M/YYYY
          if (this.dataMap[key].type === 'date') {
            formData[key] = this.utilities.parseDate(formData[key]);
          }
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

      if (this.type === IMPORTING_TYPES.ORDER_LINE) {
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

      if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        this.customerService.createCustomer(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.orderTypeService.createOrderType(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.SECTIONS) {
        this.sectionService.createSection(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.TRANSPORTS) {
        setTimeout(() => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('This function is on development', 'OK');
        }, 2000);
        /* this.transportService.createTransport(toUpload, 'response').pipe(retry(3))
        .subscribe(observer);*/
      }
    } else {
      this.dialogRef.close(toUpload);
    }
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
