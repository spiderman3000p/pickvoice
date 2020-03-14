import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, ItemType, UnityOfMeasure, Location, Order, ItemsService, LocationsService, ItemTypeService,
         OrderService, Customer, OrderLine, UomService } from '@pickvoice/pickvoice-api';
import { DataStorage } from '../../services/data-provider';
import { from, Observable } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';
import { Location as WebLocation } from '@angular/common';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ModelFactory } from '../../models/model-factory.class';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PrintComponent } from '../../components/print/print.component';

@Component({
  selector: 'app-edit-row',
  templateUrl: './edit-row.component.html',
  styleUrls: ['./edit-row.component.scss']
})

export class EditRowComponent implements OnInit {
  form: FormGroup;
  pageTitle = '';
  cardTitle = '';
  type: string;
  dataMap: any;
  remoteSync: boolean;
  keys: string[];
  row: any;
  isLoadingResults = false;
  printElement = {};
  viewMode: string;
  constructor(
    private dataProvider: DataStorage, private utilities: UtilitiesService, private location: WebLocation,
    private itemService: ItemsService, private locationService: LocationsService,
    private activatedRoute: ActivatedRoute, private orderService: OrderService,
    private itemTypeService: ItemTypeService, private router: Router, private uomsService: UomService
  ) {
    // const data = this.dataProvider.sharedData;
    // this.row = data.row; // object
    // this.utilities.log('row recibida', this.row);
    // this.dataMap = data.map; // map of object
    // this.utilities.log('fields', this.dataMap);
    // this.type = data.type; // map of object
    // this.init();
    this.pageTitle = this.viewMode === 'edit' ? 'Edit Row' : 'View Row';
  }

  init() {
    this.utilities.log('type', this.type);
    // this.remoteSync = data.remoteSync; // map of object
    this.dataMap = this.utilities.dataTypesModelMaps[this.type];
    this.utilities.log('remoteSync', this.remoteSync);
    this.utilities.log('dataMap', this.dataMap);
    const formControls = {};
    this.keys = Object.keys(this.dataMap);
    this.utilities.log('keys', this.keys);
    let value = '';
    this.utilities.log('type', this.type);
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
    this.form = new FormGroup(formControls);
  }

  export() {
    this.utilities.exportToXlsx(this.row, this.cardTitle);
  }

  print() {
    // this.utilities.print('printSection');
    // this.router.navigate([`/pages/${this.type}/print`, this.row.id]);
    window.open(`/print/${this.type}/${this.row.id}`, '_blank');
  }

  onSubmit() {
    this.utilities.log('onSubmit');
    const formData = this.form.value;
    const toUpload = this.row;
    this.utilities.log('form data', formData);
    if (this.remoteSync) {
      this.isLoadingResults = true;
      // Necesitamos guardar los cambios en el objeto recibido
      for (const key in toUpload) {
        if (this.type === IMPORTING_TYPES.ITEMS && typeof toUpload[key] === 'object' && toUpload[key] &&
          toUpload[key].code && formData[key]) {
            // mapear los datos de las propiedades tipo objeto de la entidad item
          toUpload[key].code = formData[key];
        } else if (this.type === IMPORTING_TYPES.LOCATIONS && typeof toUpload[key] === 'object' && toUpload[key] &&
          formData[key]) {
            // TODO: mapear los datos de las propiedades tipo objeto de la entidad location
        } else if (this.type === IMPORTING_TYPES.ORDERS && typeof toUpload[key] === 'object' && toUpload[key] &&
          formData[key]) {
            // TODO: mapear los datos de las propiedades tipo objeto de la entidad order
        } else if (formData[key]) {
          // las propiedades simples (que no son objetos)
          toUpload[key] = formData[key];
        }
      }
      /*if (this.type === 'items') {
        toUpload = new Object(this.form.value) as any;
        let aux = toUpload.itemType;
        toUpload.itemType = {
          code: aux
        } as ItemType;
        aux = toUpload.uom;
        toUpload.uom = {
          code: aux
        } as UnityOfMeasure;
      */
      const observer = {
        next: (response) => {
          this.isLoadingResults = false;
          this.utilities.log('update response', response);
          /*aux = toUpload.itemType.code;
          toUpload.itemType = aux;
          aux = toUpload.uom.code;
          toUpload.uom = aux;*/
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
      this.utilities.log('data to upload', toUpload);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        this.itemService.updateItem(toUpload, this.row.id, 'response', false).pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.LOCATIONS) {
        this.locationService.updateLocation(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ORDERS) {
        this.orderService.updateOrder(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        this.itemTypeService.updateItemType(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }

      if (this.type === IMPORTING_TYPES.UOMS) {
        this.uomsService.updateUom(toUpload, this.row.id, 'response').pipe(retry(3))
        .subscribe(observer);
      }
    } else {
      this.dataProvider.returnData = toUpload;
      this.location.back();
    }
  }

  back() {
    this.location.back();
  }

  reloadData() {
    // TODO: reload data from resolver
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {
      row: any,
      viewMode: string,
      type: string
    }) => {
      this.viewMode = data.viewMode;
      this.type = data.type;
      console.log('viewMode', this.viewMode);
      const keys = Object.keys(data.row).filter(key => key !== 'id');
      const keysForItem = keys.filter(key => key !== 'state');
      console.log('ngOnInit => row received', data.row);
      if (this.type === IMPORTING_TYPES.ITEMS) {
        console.log('object is an item');
        this.row = data.row as Item;
        this.cardTitle = 'Item sku # ' + this.row.sku;
      } else if (this.type === IMPORTING_TYPES.LOCATIONS) {
        console.log('object is a location');
        this.row = data.row as Location;
        this.cardTitle = 'Location code # ' + this.row.code;
      } else if (this.type === IMPORTING_TYPES.ORDERS) {
        this.row = data.row as Order;
        this.cardTitle = 'Order # ' + this.row.orderNumber;
      } else if (this.type === IMPORTING_TYPES.ITEM_TYPE) {
        console.log('object is an item type');
        this.row = data.row as ItemType;
        this.cardTitle = 'Item Type ' + this.row.description;
      } else if (this.type === IMPORTING_TYPES.UOMS) {
        console.log('object is an uom');
        this.row = data.row as UnityOfMeasure;
        this.cardTitle = 'Unity of measure ' + this.row.description;
      } else {
        this.cardTitle = 'Unknown object type';
        console.error('object is unknown');
      }
      this.remoteSync = true;
      this.init();
    });
  }
}
