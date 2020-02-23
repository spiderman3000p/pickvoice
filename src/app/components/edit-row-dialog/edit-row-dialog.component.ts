import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService,
         OrderService } from '@pickvoice/pickvoice-api';
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
  fields: any;
  remoteSync: boolean;
  keys: string[];
  row: any;
  isLoadingResults = false;
  constructor(public dialogRef: MatDialogRef<EditRowDialogComponent>, private dataProvider: DataStorage,
              private itemService: ItemsService, private locationService: LocationsService,
              private orderService: OrderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    this.row = data.row; // object
    this.utilities.log('row recibida', this.row);
    this.fields = data.map; // map of object
    this.utilities.log('fields', this.fields);
    this.type = data.type; // map of object
    this.utilities.log('type', this.type);
    this.remoteSync = data.remoteSync; // map of object
    this.utilities.log('remoteSync', this.remoteSync);
    const formControls = {};
    this.keys = Object.keys(this.fields);
    this.utilities.log('keys', this.keys);
    let value = '';
    this.utilities.log('data type', this.type);
    this.keys.forEach((key, index) => {
      if (this.row === undefined) {
        return;
      }
      value = this.row[key];
      if (this.type === 'items') {
        if (key === 'itemType') {
          value = this.row.itemType.code;
        }
        if (key === 'uom') {
          value = this.row.uom.code;
        }
      }
      if (this.fields[key].required) {
        formControls[key] = new FormControl(value, Validators.required);
      } else {
        formControls[key] = new FormControl(value);
      }
    });
    this.dialogTitle = 'Edit Row';
    this.form = new FormGroup(formControls);
  }

  onSubmit() {
    const toReturn = this.form.value;
    let toUpload;
    this.utilities.log('data to return', toReturn);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      if (this.type === 'items') {
        toUpload = new Object(this.form.value) as any;
        let aux = toUpload.itemType;
        toUpload.itemType = {
          code: aux
        } as ItemType;
        aux = toUpload.uom;
        toUpload.uom = {
          code: aux
        } as UnityOfMeasure;
        this.utilities.log('data to upload', toUpload);
        this.itemService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(response => {
          this.isLoadingResults = false;
          this.utilities.log('update response', response);
          aux = toUpload.itemType.code;
          toUpload.itemType = aux;
          aux = toUpload.uom.code;
          toUpload.uom = aux;
          this.dialogRef.close(toUpload);
        }, error => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on edit row request', 'OK');
          this.utilities.error('error on update', error);
        });
      }

      if (this.type === 'locations') {
        toUpload = this.form.value;
        this.locationService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(response => {
          this.isLoadingResults = false;
          this.utilities.log('update locations response', response);
          this.dialogRef.close(toUpload);
        }, error => {
          this.isLoadingResults = false;
          this.dialogRef.close(toUpload);
          this.utilities.showSnackBar('Error on update data', 'OK');
          this.utilities.log('update locations response', error);
        });
      }
    } else {
      this.dialogRef.close(toReturn);
    }
  }

  ngOnInit(): void {
  }

}
