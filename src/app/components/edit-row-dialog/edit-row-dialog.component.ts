import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
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
    console.log('row recibida', this.row);
    this.fields = data.map; // map of object
    console.log('fields', this.fields);
    this.type = data.type; // map of object
    console.log('type', this.type);
    this.remoteSync = data.remoteSync; // map of object
    console.log('remoteSync', this.remoteSync);
    const formControls = {};
    this.keys = Object.keys(this.fields);
    console.log('keys', this.keys);
    let value = '';
    console.log('data type', this.type);
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
    console.log('data to return', this.form.value);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      if (this.type === 'items') {
        const item = new Object(this.form.value) as any;
        let aux = item.itemType;
        item.itemType = {
          code: aux
        } as ItemType;
        aux = item.uom;
        item.uom = {
          code: aux
        } as UnityOfMeasure;
        console.log('item to upload', item);
        this.itemService.updateItem(item, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(response => {
          this.isLoadingResults = false;
          console.log('update response', response);
          aux = item.itemType.code;
          item.itemType = aux;
          aux = item.uom.code;
          item.uom = aux;
          this.dialogRef.close(item);
        }, error => {
          this.isLoadingResults = false;
          console.error('error on update', error);
        });
      }
      if (this.type === 'locations') {
        this.locationService.updateLocation(this.form.value, this.row.id, 'response').pipe(retry(3))
        .subscribe(response => {
          this.isLoadingResults = false;
          console.log('update locations response', response);
        }, error => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on update data', 'OK');
          console.log('update locations response', error);
        });
      }
    }
  }

  ngOnInit(): void {
  }

}
