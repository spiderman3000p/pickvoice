import { OnDestroy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { Location as WebLocation } from '@angular/common';
import { DataProviderService} from '../../services/data-provider.service';
import { ModelMap } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';

@Component({
  selector: 'app-edit-dock',
  templateUrl: './edit-dock.component.html',
  styleUrls: ['./edit-dock.component.scss']
})
export class EditDockComponent implements OnInit, OnDestroy {
  definitions = ModelMap.DockMap;
  form: FormGroup;
  row: any;
  isLoadingResults = false;
  selectsData: any;
  subscriptions: Subscription[] = [];
  selectedOwners = [];
  viewMode = 'view';
  titlePage = 'View Dock';
  constructor(
    private utilities: UtilitiesService, private activatedRoute: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private location: WebLocation,
    private dataProviderService: DataProviderService
  ) {
  }

  initForm() {
    const formControls = {};
    let validators;
    let value;
    Object.keys(ModelMap.DockMap).forEach((key, index) => {
      validators = null;
      value = this.row[key];
      if (this.definitions[key] && this.definitions[key].required !== undefined &&
        this.definitions[key].required === true) {
        validators = Validators.required;
      }
      if (this.definitions[key] && this.definitions[key].type === 'boolean') {
        value = false;
      }
      formControls[key] = new FormControl(value, validators);
    });
    this.form = new FormGroup(formControls);
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
          this.router.navigate(['/pages/docks']);
        } else {
          this.utilities.showSnackBar('Unknown Error on create depot', 'OK');
        }
      },
      error: (error) => {
        this.isLoadingResults = false;
        this.utilities.showSnackBar('Error on create request', 'OK');
        this.utilities.error('error on create', error);
      }
    };
    this.utilities.log('data to upload', toUpload);
    this.subscriptions.push(this.dataProviderService.createDock(toUpload)
    .subscribe(observer));
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.activatedRoute.data.subscribe((data: {
      data: any,
      viewMode: string
    }) => {
      console.log('data', data.data);
      this.viewMode = data.viewMode;
      this.titlePage = this.viewMode === 'edit' ? 'Edit Dock' : 'View Dock';
      this.selectsData = {};
      if (data.data) {
        data.data.row.subscribe(result => {
          this.utilities.log('loaded row', result);
          this.row = result;
          this.initForm();
        });
        this.selectsData.locationTypes = data.data.locationTypes;
        this.selectsData.locationStates = data.data.locationStates;
        this.selectsData.dockTypes = data.data.dockTypes;
        this.selectsData.sections = data.data.sections;
        console.log('selects data', this.selectsData);
        this.isLoadingResults = false;
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error fetching data', error);
      this.utilities.showSnackBar('Error fetching data', 'OK');
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
