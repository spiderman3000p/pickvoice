import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { MyDataSource } from '../../models/my-data-source';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';

import { Lpns } from '../../models/lpns.model';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';

import { FormGroup, FormControl } from '@angular/forms';
import { Subject, merge, Subscription, Observable, Observer } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, tap  } from 'rxjs/operators';

import { Router } from '@angular/router';

@Component({
  selector: 'app-lpns',
  templateUrl: './lpns.component.html',
  styleUrls: ['./lpns.component.css']
})
export class LpnsComponent implements OnInit, AfterViewInit, OnDestroy {
  definitions: any = ModelMap.LpnListMap;
  dataToSend: Lpns[];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  isLoadingResults = false;
  isLoadingLpnsDetail = false;
  type = IMPORTING_TYPES.LPN_LIST;
  subscriptions: Subscription[] = [];
  selectedLpns: any;
  nodes = [];
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  dataSource: MyDataSource<Lpns>;
  filterParams = '';
  paginatorParams = '';
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private dataProviderService: DataProviderService, private router: Router,
              private utilities: UtilitiesService, private dialog: MatDialog) {
      this.filter = new FormControl('');
      this.dataToSend = [];
      this.selectedLpns = {};
      this.utilities.log('filters', this.filters);
      this.filtersForm = new FormGroup({
        code: new FormControl(''),
        type: new FormControl(''),
        state: new FormControl(''),
        interface: new FormControl(''),
        labelWithMaterial: new FormControl('')
      });
      this.initColumnsDefs();
  }

  ngOnInit() {
    this.dataSource = new MyDataSource(this.dataProviderService, 'local');
    this.dataSource.paginator = this.paginator;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.loadData();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadDataPage()))
    .subscribe();
  }

  viewLpnsDetail(event: any) {
    const lpns = event.node.data;
    this.utilities.log('data: ', lpns);
    this.selectedLpns = {};
    if (lpns.id && lpns.id.includes('IT')) {
      this.isLoadingLpnsDetail = true;
      const id = lpns.id.replace('IT', '');
      this.dataProviderService.getLpn(id).subscribe(result => {
        this.isLoadingLpnsDetail = false;
        this.utilities.log('lpns details: ', result);
        if (result && result.content && result.content.length > 0 && result.content[0].lpnItemId) {
          this.selectedLpns = result.content[0];
        }
      });
    }
  }

  resetFilters() {
    this.filtersForm.reset();
  }

  applyFilters() {
    const formValues = this.filtersForm.value;
    const filters = this.filters.filter(filter => filter.show &&
                    formValues[filter.key] && formValues[filter.key].length > 0);
  }

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editRowOnDialog(element: any) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: ModelMap.LpnMap,
        type: IMPORTING_TYPES.LPN,
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
            /*this.dataSource.data[element.index] = result;
            this.refreshTable();*/
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  initColumnsDefs() {
    let filter: any;
    const formControls = {} as any;
    const filtersFields = ['code', 'state', 'type', 'interface'];
    filtersFields.forEach((column, index) => {
        filter = new Object();
        filter.show = column;
        filter.name = this.definitions[column].name;
        filter.type = this.definitions[column].formControl.type;
        filter.key = column;
        formControls[column] = new FormGroup({
          type: new FormControl('contains'),
          value: new FormControl('')
        });
        filter.controls = formControls[column].controls;
        filter.controls.value.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), tap((value) => {
          this.utilities.log(`valor del campo ${column} cambiando a: `, value);
          this.applyFilters();
        })).subscribe();
        this.filters[column] = filter;
    });
    this.filtersForm = new FormGroup(formControls);
    this.utilities.log('filters', this.filters);
    this.utilities.log('formControls', formControls);
    this.utilities.log('form values', this.filtersForm.value);
  }

  getFilterParams(): string {
    const formValues = this.filtersForm.value;
    this.utilities.log('filter form values: ', formValues);
    const filtersToUse = [];
    for (const filterKey in this.filters) {
      if ((this.filters[filterKey].controls.value.value !== undefined &&
         this.filters[filterKey].controls.value.value !== null &&
         this.filters[filterKey].controls.value.value !== '')) {
        filtersToUse.push(this.filters[filterKey]);
      }
    }
    let aux = '';
    const stringParams = filtersToUse.length > 0 ? filtersToUse.map(filter => {
      aux = `${filter.key}-filterType=${filter.type};${filter.key}-type=` +
      `${formValues[filter.key].type};`;

      if (filter.type === 'date' && formValues[filter.key].type === 'inRange') {
        aux += `${filter.key}-dateFrom=${formValues[filter.key].value};${filter.key}` +
        `-dateTo=${formValues[filter.key].valueTo}`;
      } else if (filter.type === 'number' && formValues[filter.key].type === 'inRange') {
        aux += `${filter.key}-filter=${formValues[filter.key].value};${filter.key}-filterTo=` +
        `${formValues[filter.key].valueTo}`;
      } else {
        aux += `${filter.key}-filter=${formValues[filter.key].value.toLowerCase()}`;
      }
      return aux;
    }).join(';') : '';
    this.utilities.log('filters to use: ', filtersToUse);
    this.utilities.log('filters string params: ', stringParams);
    return stringParams;
  }

  getPaginatorParams(): string {
    const startRow = this.paginator.pageIndex * this.paginator.pageSize;
    return `startRow=${startRow};endRow=${startRow + this.paginator.pageSize}`;
  }

  loadDataPage() {
    this.paginatorParams = this.getPaginatorParams();
    const paramsArray = Array.of(this.paginatorParams, this.filterParams)
    .filter(paramArray => paramArray.length > 0);
    const params = paramsArray.length > 0 ? paramsArray.join(';') : '';
    // this.utilities.log('loadDataPage() params: ', params);
    this.dataSource.loadData(this.type, `${params}`)
    .subscribe((response: any) => {
        // this.utilities.log('this.dataSource.loadData() response: ', response);
        if (response && response.content) {
            this.dataSource.lastRow = response.pageSize;
            this.dataSource.data = response.content;
            // this.nodes = this.generateNodes(response.content);
            this.dataSource.dataCount = response.totalElements;
            this.dataSource.dataSubject.next(this.dataSource.data);
        }
    }, error => {
      this.utilities.error('Error fetching data from server');
      this.utilities.showSnackBar('Error fetching data from server', 'OK');
    });
  }

  generateNodes(results: any): any[] {
    const newData = [];
    results.slice().forEach((element, index) => {
      if (element.root == null) {
        newData.push({
          id: element.id,
          name: element.description,
          children: []
        });
        results.splice(index, 1);
      }
    });
    let aux;
    let auxIndex;
    results.slice().forEach((element, index) => {
      if (element.root != null) {
        auxIndex = newData.findIndex(el => el.id === element.root);
        if (auxIndex > -1) {
          aux = newData[auxIndex];
          aux.children.push({
            id: element.id,
            name: element.description,
            children: []
          });
          results.splice(index, 1);
        }
      }
    });
    // this.utilities.log('newData: ', newData);
    return newData;
  }

  loadData(useCache = true) {
    this.utilities.log('requesting Lpns');
    this.isLoadingResults = true;
    let newData;
    let results = [];
    this.subscriptions.push(this.dataProviderService.getAllLpns().subscribe((res: any) => {
      this.isLoadingResults = false;
      // this.utilities.log('lpns received', results);
      if (res && res.content && res.content.length > 0) {
        results = res.content;
      } else if (res) {
        results = res;
      }
      newData = this.generateNodes(results);
      // this.utilities.log('newData: ', newData);
      // this.nodes = newData;
      this.dataSource.localData = newData;
      this.loadDataPage();
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.lpn);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: ModelMap.LpnMap,
        type: IMPORTING_TYPES.LPN,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New LPNS'
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        /*this.dataSource.data.push(result);
        this.refreshTable();*/
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  export() {
    /*const dataToExport = this.dataSource.data.map((row: any) => {
      return this.utilities.getJsonFromObject(row, this.type);
    });
    this.utilities.exportToXlsx(dataToExport, 'Lpns List');*/
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
