import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, Customer, OrderLine, Section,
         OrderType, Transport, Dock } from '@pickvoice/pickvoice-api';
import { SharedDataService } from '../../services/shared-data.service';
import { DataProviderService} from '../../services/data-provider.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, from, Observable } from 'rxjs';
import { retry, tap } from 'rxjs/operators';
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
  defaultValues: any;
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
    this.defaultValues = data.defaultValues;
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    this.utilities.log('keys', this.keys);
    this.row = ModelFactory.newEmptyObject(this.type);
    this.utilities.log('new empty ' + this.type, this.row);
    for (let key in this.defaultValues) {
      if (this.row[key] !== undefined) {
        this.row[key] = this.defaultValues[key];
      }
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
        formControls[key] = new FormControl(this.row[key], [Validators.required]);
      } else {
        formControls[key] = new FormControl(this.row[key]);
      }
      if (this.dataMap[key].formControl.control === 'select') {
        if (this.defaultValues === undefined || (this.defaultValues !== undefined &&
          this.defaultValues[key] === undefined)) {
          this.utilities.log(`obteniendo select data para ${key}`);
          this.subscriptions.push(this.dataProviderService.getDataFromApi(this.dataMap[key].type)
          .pipe(tap(result => this.utilities.log(`${key} results`, result))).subscribe(results => {
            if (results) {
              if (results.content && results.pageSize) {
                this.selectsData[key] = results.content;
              } else {
                this.selectsData[key] = results;
              }
            }
          }));
          formControls[key].patchValue('');
        }
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
          // this.dataProviderService.getDataFromApi(objectType).subscribe();
          this.selectsData[key].push(result);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('formulario:', this.form.value);
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.utilities.log('onSubmit -------------');
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
          if ((response.status === 204 || response.status === 200 || response.status === 201)) {
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
      this.subscriptions.push(this.dataProviderService.createObject(this.type, toUpload)
      .subscribe(observer));
    } else {
      this.dialogRef.close(toUpload);
    }
  }

  getColumnsClasses() {
    let classes = 'col-sm-12 col-md-4 col-lg-3';
    if (this.keys.length >= 5) {
      classes = 'col-sm-12 col-md-4 col-lg-3';
    } else if (this.keys.length >= 3) {
      classes = 'col-sm-12 col-md-4 col-lg-4';
    } else if (this.keys.length > 1) {
      classes = 'col-sm-12 col-md-6 col-lg-6';
    }
    return classes;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
