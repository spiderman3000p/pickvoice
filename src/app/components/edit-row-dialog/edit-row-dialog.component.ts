import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, Transport, Customer, OrderLine, OrderType,
         Section } from '@pickvoice/pickvoice-api';
import { DataProviderService} from '../../services/data-provider.service';
import { AddRowDialogComponent } from '../add-row-dialog/add-row-dialog.component';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { SharedDataService } from '../../services/shared-data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-edit-row-dialog',
  templateUrl: './edit-row-dialog.component.html',
  styleUrls: ['./edit-row-dialog.component.scss']
})

export class EditRowDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dialogTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any;
  isLoadingResults = false;
  viewMode: string;
  selectsData: any;
  subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<EditRowDialogComponent>, private sharedDataService: SharedDataService,
              private dialog: MatDialog, private dataProviderService: DataProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    this.row = data.row; // object
    this.utilities.log('row recibida', this.row);

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
    this.utilities.log('data type', this.type);
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
        this.subscriptions.push(this.dataProviderService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.subscriptions.push(this.dataProviderService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ORDERS_DTO) {
        this.subscriptions.push(this.dataProviderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.subscriptions.push(this.dataProviderService.updateItemType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.subscriptions.push(this.dataProviderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.ORDER_TYPE) {
        this.subscriptions.push(this.dataProviderService.updateOrderType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.subscriptions.push(this.dataProviderService.updateUom(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.TRANSPORTS) {
        this.subscriptions.push(this.dataProviderService.updateTransport(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer));
      }

      if (this.type === IMPORTING_TYPES.SECTIONS) {
        this.subscriptions.push(this.dataProviderService.updateSection(toUpload, this.row.id, 'response').pipe(retry(3))
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
