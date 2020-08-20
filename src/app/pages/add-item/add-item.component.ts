import { OnDestroy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { Location as WebLocation } from '@angular/common';
import { DataProviderService} from '../../services/data-provider.service';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit, OnDestroy {
  dataMap = ModelMap.ItemMap;
  form: FormGroup;
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  itemData: any;
  subscriptions: Subscription[] = [];
  constructor(
    private utilities: UtilitiesService, private activatedRoute: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private location: WebLocation,
    private dataProviderService: DataProviderService
  ) {
    const formControls = {};
    this.row = ModelFactory.newEmptyItem();
    let validators;
    let value;
    Object.keys(this.row).forEach((key, index) => {
      validators = null;
      value = '';
      if (this.dataMap[key] && this.dataMap[key].required !== undefined && this.dataMap[key].required === true) {
        validators = Validators.required;
      }
      if (this.dataMap[key] && this.dataMap[key].type === 'boolean') {
        value = false;
      }
      formControls[key] = new FormControl(value, validators);
    });
    this.form = new FormGroup(formControls);
    this.utilities.log('form', this.form.value);
  }
  addNewObject(objectType: string, myTitle: string) {
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps[objectType],
        type: objectType,
        title: myTitle,
        remoteSync: true, // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.utilities.showSnackBar('Resgistered correct', 'OK');
        // TODO: agregar los tipos de datos que se pueden agregar desde selects
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.log('formulario:', this.form.value);
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    for (const key in toUpload) {
      if (formData[key] !== undefined) {
        toUpload[key] = formData[key];
      }
    }
    this.isLoadingResults = true;
    const observer = {
      next: (response) => {
        this.isLoadingResults = false;
        this.utilities.log('create response', response);
        if (response && (response.id)) {
          this.utilities.showSnackBar('Create Successfull', 'OK');
          this.router.navigate(['/pages/items']);
        } else {
          this.utilities.showSnackBar('Unknown Error on create item', 'OK');
        }
      },
      error: (error) => {
        this.isLoadingResults = false;
        this.utilities.showSnackBar('Error on create request', 'OK');
        this.utilities.error('error on create', error);
      }
    };
    this.utilities.log('data to upload', toUpload);
    this.subscriptions.push(this.dataProviderService.createItem(toUpload, this.row.id)
    .subscribe(observer));
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.activatedRoute.data.subscribe((data: {
      data: any
    }) => {
      console.log('data', data.data);
      this.itemData = {};
      if (data.data) {
        Object.keys(data.data).forEach(key => {
          console.log('datos de ' + key);
          this.itemData[key] = data.data[key];
        });
        this.isLoadingResults = false;
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error fetching data. check Internet conection');
      this.utilities.showSnackBar('Error fetching data', 'OK');
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
