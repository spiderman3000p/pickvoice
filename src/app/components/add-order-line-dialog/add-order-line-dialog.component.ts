import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';
import { Item, OrderLine } from '@pickvoice/pickvoice-api';
import { SharedDataService } from '../../services/shared-data.service';
import { DataProviderService} from '../../services/data-provider.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subject, Subscription, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, concat, retry, tap, switchMap } from 'rxjs/operators';
import { ModelFactory } from '../../models/model-factory.class';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { AddRowDialogComponent } from '../add-row-dialog/add-row-dialog.component';

@Component({
  selector: 'app-add-order-line-dialog',
  templateUrl: './add-order-line-dialog.component.html',
  styleUrls: ['./add-order-line-dialog.component.scss']
})

export class AddOrderLineDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  type = IMPORTING_TYPES.ORDER_LINE;
  definitions = ModelMap.OrderLineMap;
  remoteSync = false;
  keys: string[];
  orderLine: OrderLine;
  isLoadingResults = false;
  selectsData: any;
  defaultValues: any;
  subscriptions: Subscription[] = [];
  itemLoading = false;
  itemInput$ = new Subject<string>();
  constructor(public dialogRef: MatDialogRef<AddOrderLineDialogComponent>, private sharedDataService: SharedDataService,
              private dialog: MatDialog, private dataProviderService: DataProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // init variables
    const formControls = {};
    this.keys = Object.keys(this.definitions);
    this.orderLine = ModelFactory.newEmptyOrderLine();
    // build form group
    this.selectsData = {};
    this.keys.forEach((key, index) => {
      // value = this.utilities.renderColumnData(this.definitions[key].type, this.row[key]);
      if (this.definitions[key].required) {
        formControls[key] = new FormControl(this.orderLine[key], [Validators.required]);
      } else {
        formControls[key] = new FormControl(this.orderLine[key]);
      }
    });
    // console.log('form controls', formControls);
    this.form = new FormGroup(formControls);
    this.selectsData.items = of([]);
  }

  trackByFn(item: Item) {
    return item.id;
  }

  addNewObject(key: string, objectType: string, myTitle: string) {
    const definitions = this.utilities.dataTypesModelMaps[objectType];
    this.utilities.log('map to send to add dialog', definitions);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: definitions,
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
    const values = this.form.value;
    values.createDate = new Date();
    this.dialogRef.close(values);
  }

  ngOnInit(): void {
    this.selectsData = {};
    // this.selectsData.items = this.dataProviderService.getAllItems('startRow=0;endRow=10');
    const searchString = 'startRow=0;endRow=10;name-filterType=text;name-type=contains;name-filter=';
    this.selectsData.items = concat(
      of([]), // default items
      this.itemInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.itemLoading = true),
          switchMap(term => this.dataProviderService.getAllItems(searchString + term).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => this.itemLoading = false)
          ))
      )
    );
    this.selectsData.qualityStates = this.dataProviderService.getAllQualityStates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
