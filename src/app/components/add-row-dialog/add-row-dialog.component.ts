import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, Customer, OrderLine, Section,
         OrderType, Transport } from '@pickvoice/pickvoice-api';
import { SharedDataService } from '../../services/shared-data.service';
import { DataProviderService} from '../../services/data-provider.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ModelFactory } from '../../models/model-factory.class';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

@Component({
  selector: 'app-add-row-dialog',
  templateUrl: './add-row-dialog.component.html',
  styleUrls: ['./add-row-dialog.component.scss']
})

export class AddRowDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dialogTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any; // Item | Location | Order | ItemType | UnityOfMeasure
  isLoadingResults = false;
  selectsData: any;
  subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<AddRowDialogComponent>, private sharedDataService: SharedDataService,
              private dialog: MatDialog, private dataProviderService: DataProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // init variables
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
    if (this.type === IMPORTING_TYPES.ITEMS) {
      this.row = ModelFactory.newEmptyItem();
      this.utilities.log('new empty item', this.row);
    }
    if (this.type === IMPORTING_TYPES.LOCATIONS) {
      this.row = ModelFactory.newEmptyLocation();
      this.utilities.log('new empty location', this.row);
    }
    if (this.type === IMPORTING_TYPES.ORDERS) {
      this.row = ModelFactory.newEmptyOrder();
      this.utilities.log('new empty order', this.row);
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
    }
    if (this.type === IMPORTING_TYPES.SECTIONS) {
      this.row = ModelFactory.newEmptySection();
      this.utilities.log('new empty section', this.row);
    }
    if (this.type === IMPORTING_TYPES.TRANSPORTS) {
      this.row = ModelFactory.newEmptyTransport();
      this.utilities.log('new empty transport', this.row);
    }
    // init variables end
    this.utilities.log('row recibida', this.row);
    // build form group
    this.selectsData = {};
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
      if (this.dataMap[key].formControl.control === 'select') {
        this.selectsData[key] =
        this.dataProviderService.getDataFromApi(this.dataMap[key].type);
        formControls[key].patchValue(-1);
      }
    });
    // console.log('form controls', formControls);
    this.form = new FormGroup(formControls);
  }

  addNewObject(key: string, objectType: string, myTitle: string) {
    const dataMap = this.utilities.dataTypesModelMaps[objectType];
    this.utilities.log('map to send to add dialog', dataMap);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: dataMap,
        type: objectType,
        title: myTitle,
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
          this.selectsData[key] = this.dataProviderService.getDataFromApi(objectType);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
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
    this.utilities.log('row data', toUpload);
    if (this.remoteSync) {
      this.isLoadingResults = true;
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
        this.subscriptions.push(this.dataProviderService.createItem(toUpload, 'response', false).pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.subscriptions.push(this.dataProviderService.createLocation(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.subscriptions.push(this.dataProviderService.createOrder(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.subscriptions.push(this.dataProviderService.createItemType(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.subscriptions.push(this.dataProviderService.createUom(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.CUSTOMERS) {
        this.subscriptions.push(this.dataProviderService.createCustomer(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.subscriptions.push(this.dataProviderService.createOrderType(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.SECTIONS) {
        this.subscriptions.push(this.dataProviderService.createSection(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.TRANSPORTS) {
        this.subscriptions.push(this.dataProviderService.createTransport(toUpload, 'response').pipe(retry(3))
        .subscribe(observer));
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
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
