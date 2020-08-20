import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { Location as WebLocation } from '@angular/common';
import { ModelMap } from '../../models/model-maps.model';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import '@ag-grid-enterprise/excel-export';
import { AgGridAngular } from 'ag-grid-angular';

interface ItemData {
  uomsList: UnityOfMeasure[];
  statesList: string[];
  itemTypeList: ItemType[];
  classificationsList: string[];
}
@Component({
  selector: 'app-edit-plant',
  templateUrl: './edit-plant.component.html',
  styleUrls: ['./edit-plant.component.scss']
})

export class EditPlantComponent implements OnInit, OnDestroy {
  definitions = ModelMap.PlantsMap;
  form: FormGroup;
  row: any;
  viewMode = 'edit';
  pageTitle = 'Edit Plant';
  isLoadingResults = false;
  selectsData: any;
  subscriptions: Subscription[] = [];
  constructor(
    private utilities: UtilitiesService, private activatedRoute: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private location: WebLocation,
    private dataProviderService: DataProviderService
  ) {
  }
  init() {
    const formControls = {
      /*countryId: null,
      departmentId: null*/
    };
    let validators;
    let value;
    Object.keys(this.row).forEach((key, index) => {
      validators = null;
      value = this.row[key];
      if (this.definitions[key] && this.definitions[key].required !== undefined && this.definitions[key].required === true) {
        validators = Validators.required;
      }
      formControls[key] = new FormControl(value, validators);
    });
    /*formControls.countryId = new FormControl('', Validators.required);
    formControls.departmentId = new FormControl('', Validators.required);*/
    this.form = new FormGroup(formControls);
    this.form.get('countryId').valueChanges.subscribe(countryId => {
      this.selectsData.departments = this.dataProviderService.getAllDepartments(countryId);
    });
    this.form.get('departmentId').valueChanges.subscribe(departmentId => {
      this.selectsData.cities = this.dataProviderService.getAllCities(departmentId);
    });
    this.utilities.log('form', this.form.value);
  }
  addNewObject(key: string, objectType: string, myTitle: string) {
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
        this.selectsData[key] = this.dataProviderService.getDataFromApi(key);
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
          this.router.navigate(['/pages/plants']);
        } else {
          this.utilities.showSnackBar('Unknown Error on create plant', 'OK');
        }
      },
      error: (error) => {
        this.isLoadingResults = false;
        this.utilities.showSnackBar('Error on create request', 'OK');
        this.utilities.error('error on create', error);
      }
    };
    this.utilities.log('data to upload', toUpload);
    this.subscriptions.push(this.dataProviderService.createPlant(toUpload, this.row.id)
    .subscribe(observer));
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string
    }) => {
      this.selectsData = {};
      this.viewMode = data.viewMode;
      this.pageTitle = this.viewMode === 'edit' ? 'Edit Plant' : 'View Plant';
      if (data.row) {
        this.selectsData.countries = data.row.countries;
        data.row.plant.subscribe(result => {
          this.row = result;
          this.isLoadingResults = false;
          this.init();
        });
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
