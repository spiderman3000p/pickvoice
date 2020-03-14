import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService, ItemTypeService,
         OrderService, Customer, OrderLine } from '@pickvoice/pickvoice-api';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { DataStorage } from '../../services/data-provider';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

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
  constructor(public dialogRef: MatDialogRef<EditRowDialogComponent>, private dataProvider: DataStorage,
              private itemService: ItemsService, private locationService: LocationsService,
              private orderService: OrderService, private itemTypeService: ItemTypeService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    this.row = data.row; // object
    this.utilities.log('row recibida', this.row);
    this.dataMap = data.map; // map of object
    this.utilities.log('fields', this.dataMap);
    this.type = data.type; // map of object
    this.utilities.log('type', this.type);
    this.remoteSync = data.remoteSync; // map of object
    this.utilities.log('remoteSync', this.remoteSync);
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    this.utilities.log('keys', this.keys);
    let value = '';
    this.utilities.log('data type', this.type);
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
    this.dialogTitle = 'Edit Row';
    this.form = new FormGroup(formControls);
  }

  onSubmit() {
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    for (const key in toUpload) {
      if (this.type === IMPORTING_TYPES.ITEMS && typeof toUpload[key] === 'object' && toUpload[key] &&
        toUpload[key].code && formData[key]) {
          // mapear los datos de las propiedades tipo objeto de la entidad item
        toUpload[key].code = formData[key];
      } else if (this.type === IMPORTING_TYPES.LOCATIONS && typeof toUpload[key] === 'object' && toUpload[key] &&
        formData[key]) {
          // TODO: mapear los datos de las propiedades tipo objeto de la entidad location
      } else if (this.type === IMPORTING_TYPES.ORDERS_DTO && typeof toUpload[key] === 'object' && toUpload[key] &&
      formData[key]) {
        // TODO: mapear los datos de las propiedades tipo objeto de la entidad order_dto
      } else if (this.type === IMPORTING_TYPES.ORDERS && typeof toUpload[key] === 'object' && toUpload[key] &&
        formData[key]) {
          // TODO: mapear los datos de las propiedades tipo objeto de la entidad order
      } else if (formData[key]) {
        // las propiedades simples (que no son objetos)
        toUpload[key] = formData[key];
      }
    }
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
    } else {
      this.dialogRef.close(toUpload);
    }
  }

  ngOnInit(): void {
  }

}
