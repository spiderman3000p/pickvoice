import { Inject, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { PrintComponent } from '../../components/print/print.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { SharedDataService } from '../../services/shared-data.service';
import { from, Observable, Observer } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface ItemData {
  uomsList: UnityOfMeasure[];
  statesList: string[];
  itemTypeList: ItemType[];
}
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})

export class EditItemComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type = IMPORTING_TYPES.ITEMS;
  dataMap = ModelMap.ItemMap;
  remoteSync: boolean;
  keys: string[];
  row: any;
  importingTypes = IMPORTING_TYPES;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  itemData: ItemData;

  constructor(
    private sharedDataService: SharedDataService, private utilities: UtilitiesService,
    private location: WebLocation, private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService, private router: Router, private dialog: MatDialog
  ) {
    this.itemData = new Object() as ItemData;
    this.itemData.uomsList = [];
    this.itemData.statesList = [];
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Item' : 'View Item';
    this.isLoadingResults = true;
  }

  init() {
    this.utilities.log('item', this.row);
    this.getUomsList();
    this.getStatesList();
    this.getItemTypeList();
    this.form = new FormGroup({
      description: new FormControl(this.row.description),
      sku: new FormControl(this.row.sku),
      upc: new FormControl(this.row.upc),
      phonetic: new FormControl(this.row.phonetic),
      itemType: new FormControl(this.row.itemType),
      uom: new FormControl(this.row.uom),
      weight: new FormControl(this.row.weight),
      variableWeight: new FormControl(this.row.variableWeight),
      weightTolerance: new FormControl(this.row.weightTolerance),
      expiryDate: new FormControl(this.row.expiryDate),
      serial: new FormControl(this.row.serial),
      batchNumber: new FormControl(this.row.batchNumber),
      scannedVerification: new FormControl(this.row.scannedVerification),
      spokenVerification: new FormControl(this.row.spokenVerification),
      itemState: new FormControl(this.row.itemState),
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  export() {
    // TODO: hacer la exportacion de la orden completa
    const dataToExport = this.row;
    this.utilities.exportToXlsx(dataToExport, 'Item # ' + this.row.sku);
  }

  getUomsList() {
    this.dataProviderService.getAllUoms().subscribe(results => {
      this.itemData.uomsList = results;
      this.utilities.log('uoms list', this.itemData.uomsList);
    });
  }

  getStatesList() {
    this.itemData.statesList = Object.keys(Item.ItemStateEnum);
  }

  getItemTypeList() {
    this.dataProviderService.getAllItemTypes().subscribe(results => {
      this.itemData.itemTypeList = results;
      this.utilities.log('item types list', this.itemData.itemTypeList);
    });
  }

  print() {
    // this.utilities.print('printSection');
    // this.router.navigate([`/pages/${this.type}/print`, this.row.id]);
    window.open(`/print/${this.type}/${this.row.id}`, '_blank');
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
    for (let key in formData) {
      if (1) {
        toUpload[key] = formData[key];
      }
    }
    this.utilities.log('data to upload', toUpload);
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
          // this.back();
        },
        error: (error) => {
          this.isLoadingResults = false;
          this.utilities.showSnackBar('Error on edit row request', 'OK');
          this.utilities.error('error on update', error);
        }
      };
      this.dataProviderService.updateItem(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
    } else {
      this.sharedDataService.returnData = toUpload;
      this.location.back();
    }
  }

  getColumnsClasses() {
    let classes = 'col-sm-12 col-md-4 col-lg-3';
    if (this.keys.length < 3) {
      classes = 'col-sm-12 col-md-6 col-lg-6';
    }
    return classes;
  }

  addNewObject(objectType: string, myTitle: string) {
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
        if (objectType === IMPORTING_TYPES.UOMS) {
          this.itemData.uomsList.push(result);
        }
        // TODO: agregar los tipos de datos que se pueden agregar desde selects
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string,
      type: string
    }) => {
      this.viewMode = data.viewMode;
      this.type = data.type;
      this.utilities.log('viewMode', this.viewMode);
      data.row.subscribe(element => {
        this.isLoadingResults = false;
        this.utilities.log('ngOnInit => row received', element);
        this.row = element;
        this.cardTitle = 'Item # ' + this.row.id;
        this.init();
      });
      this.remoteSync = true;
    });
  }
}
