import { OnDestroy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { OwnerSelectorDialogComponent } from '../../components/owner-selector-dialog/owner-selector-dialog.component';
import { PlantSelectorDialogComponent } from '../../components/plant-selector-dialog/plant-selector-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { Location as WebLocation } from '@angular/common';
import { DataProviderService} from '../../services/data-provider.service';
import { ModelMap } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';

@Component({
  selector: 'app-add-depot',
  templateUrl: './add-depot.component.html',
  styleUrls: ['./add-depot.component.scss']
})
export class AddDepotComponent implements OnInit, OnDestroy {
  definitions = ModelMap.DepotsMap;
  form: FormGroup;
  row: any;
  isLoadingResults = false;
  selectsData: any;
  subscriptions: Subscription[] = [];
  selectedOwners = [];
  selectedPlant = {
    name: ''
  };
  constructor(
    private utilities: UtilitiesService, private activatedRoute: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private location: WebLocation,
    private dataProviderService: DataProviderService
  ) {
    const formControls = {};
    this.row = ModelFactory.newEmptyDepot();
    let validators;
    let value;
    Object.keys(this.row).forEach((key, index) => {
      validators = null;
      value = '';
      if (this.definitions[key] && this.definitions[key].required !== undefined && this.definitions[key].required === true) {
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

  openOwnerSelector() {
    let exist;
    const dialogRef = this.dialog.open(OwnerSelectorDialogComponent, {
      width: '400px',
      data: {
        collection: this.dataProviderService.getAllOwners(),
        title: 'Select Owner',
        message: 'Please select an owner from the list'
      }
    });
    dialogRef.afterClosed().subscribe(selectedOwner => {
      this.utilities.log('owner selector dialog result:', selectedOwner);
      if (selectedOwner) {
        exist = this.selectedOwners.findIndex(owner => owner.id === selectedOwner.id);
        if (exist === -1) {
          this.selectedOwners.push(selectedOwner);
        } else {
          this.utilities.showSnackBar('Selected owner already added', 'OK');
        }
      }
    }, error => {
      this.utilities.error('error after closing owner selector dialog');
      this.utilities.showSnackBar('Error after closing owner selector dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  openPlantSelector() {
    const dialogRef = this.dialog.open(PlantSelectorDialogComponent, {
      width: '700px',
      data: {
        collection: this.dataProviderService.getAllPlants(),
        title: 'Select Plant',
        message: 'Please select a plant from the list'
      }
    });
    dialogRef.afterClosed().subscribe(selectedPlant => {
      this.utilities.log('plant selector dialog result:', selectedPlant);
      if (selectedPlant) {
        this.form.get('plantId').setValue(selectedPlant.id);
        this.selectedPlant = selectedPlant;
      }
    }, error => {
      this.utilities.error('error after closing plant selector dialog');
      this.utilities.showSnackBar('Error after closing plant selector dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  removeOwner(selectedOwner: any) {
    const index = this.selectedOwners.findIndex(owner => owner.id === selectedOwner.id);
    if (index > -1) {
      this.selectedOwners.splice(index, 1);
    }
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
          this.router.navigate(['/pages/depots']);
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
    this.subscriptions.push(this.dataProviderService.createDepot(toUpload, this.row.id)
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
      this.selectsData = {};
      if (data.data) {
        Object.keys(data.data).forEach(key => {
          this.selectsData[key] = data.data[key];
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
