import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { MyDataSource } from '../../models/my-data-source';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { PrintLabelDialogComponent } from '../../components/print-label-dialog/print-label-dialog.component';
import {
          GenerateLpnIntervalDialogComponent
       } from '../../components/generate-lpn-interval-dialog/generate-lpn-interval-dialog.component';
import { Lpn } from '@pickvoice/pickvoice-api';

import { ModelMap, IMPORTING_TYPES, STATES } from '../../models/model-maps.model';

import { FormGroup, FormControl } from '@angular/forms';
import { of, Subscription, Observer } from 'rxjs';
import { tap  } from 'rxjs/operators';

import { Router } from '@angular/router';

@Component({
  selector: 'app-lpns',
  templateUrl: './lpns.component.html',
  styleUrls: ['./lpns.component.css']
})
export class LpnsComponent implements OnInit, AfterViewInit, OnDestroy {
  filtersForm: FormGroup;
  filters: any[] = [];
  actionForSelected: FormControl;
  isLoadingResults = false;
  isLoadingLpnsDetail = false;
  type = IMPORTING_TYPES.LPN_LIST;
  subscriptions: Subscription[] = [];
  selectedLpns: any;
  lpnToPrint: any;
  selectedNodes = [];
  nodes = [];
  length = 100;
  pageSize = 15;
  states = STATES;
  pageSizeOptions: number[] = [5, 15, 10, 25, 100];
  // MatPaginator Output
  dataSource: MyDataSource<any>;
  filterParams = '';
  paginatorParams = '';
  pageEvent: PageEvent;
  options: any = {
    useCheckbox: true,
    getChildren: this.getChildren.bind(this)
  };
  selectsData = {
    types: of([]),
    states: of([]),
    interfaces: of([])
  };
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private dataProviderService: DataProviderService, private router: Router,
              private utilities: UtilitiesService, private dialog: MatDialog) {
      this.selectedLpns = {};
      this.utilities.log('filters', this.filters);
      this.filtersForm = new FormGroup({
        code: new FormControl(''),
        type: new FormControl(''),
        state: new FormControl(''),
        interface: new FormControl(''),
        labelWithMaterial: new FormControl('')
      });
  }

  ngOnInit() {
    this.dataSource = new MyDataSource(this.dataProviderService, 'local');
    this.dataSource.paginator = this.paginator;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    this.loadSelectsData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadDataPage()))
    .subscribe();
  }

  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(node.children), 1000);
    });
  }

  onSelect(event) {
    try {
      this.selectedNodes.push(event.node.data);
    } catch (e) {
      this.utilities.log(e.message);
    }
  }

  onDeSelect(event) {
    try {
      const index = this.selectedNodes.findIndex(node => node === event.node.data);
      if (index > -1) {
        this.selectedNodes.splice(index, 1);
      }
    } catch (e) {
      this.utilities.error('Error deselecting node: ', e.message);
    }
  }

  viewLpnsDetail(lpns: any) {
    this.utilities.log('data: ', lpns);
    this.selectedLpns = {};
    if (this.isItem(lpns)) {
      this.utilities.log('lpn is item');
      this.isLoadingLpnsDetail = true;
      const id = this.getIdFromNode(lpns);
      this.utilities.log('lpn id: ', id);
      this.dataProviderService.getLpnItemVO2(id).subscribe(result => {
        this.isLoadingLpnsDetail = false;
        this.utilities.log('lpns details: ', result);
        if (result && result.content && result.content.length > 0 && result.content[0].lpnItemId) {
          this.selectedLpns = result.content[0];
          this.lpnToPrint = this.selectedLpns;
        }
      }, error => {
        this.isLoadingLpnsDetail = false;
        this.utilities.error('Error al cargar detalles: ', error);
      });
    } else if (this.isRoot(lpns)) {
      this.utilities.log('lpn is root');
      this.isLoadingLpnsDetail = true;
      const id = this.getIdFromNode(lpns);
      this.utilities.log('lpn id: ', id);
      this.dataProviderService.getLpn(id).subscribe(result => {
        this.isLoadingLpnsDetail = false;
        this.utilities.log('lpns details: ', result);
        if (result && result.content && result.content.length > 0 && result.content[0].lpnId) {
          this.selectedLpns = result.content[0];
          this.lpnToPrint = this.selectedLpns;
        }
      }, error => {
        this.isLoadingLpnsDetail = false;
        this.utilities.error('Error al cargar detalles: ', error);
      });
    }
  }

  resetFilters() {
    this.filtersForm.reset();
    this.loadDataPage();
  }

  applyFilters() {
    this.loadData();
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

  executeContext(action: string, lpn: any) {
    this.utilities.log('action: ', action);
    this.utilities.log('lapn: ', lpn);
    switch (action) {
      case 'print': this.print(lpn); break;
      case 'details': this.viewLpnsDetail(lpn); break;
      default: this.utilities.log('Accion no definida');
    }
  }
  /* TODO: delete
  generateHtmlContent(lpn: any, htmlTemplate: string): string {
    const htmlWrapper = document.createElement('div');
    htmlWrapper.innerHTML = htmlTemplate;
    let objectMap;
    let barcode;
    const spanAux = document.createElement('span');
    this.utilities.log('gerating html to lpn:', lpn);
    // sustituir valores segun el mapa
    if (lpn.code) { // si es lpn padre
      objectMap = ModelMap.LpnVO3Map;
      barcode = this.utilities.generateBarCode(lpn.code);
    } else if (lpn.sku) { // si es lpn hijo
      objectMap = ModelMap.LpnItemVO2Map;
      barcode = this.utilities.generateBarCode(lpn.sku);
    }
    this.utilities.log('model map to use for print:', objectMap);
    // replace demo barcode
    spanAux.innerHTML = barcode;
    const htmlBarCode = htmlWrapper.querySelector('#data-barcode');
    if (htmlBarCode) {
      this.utilities.log(`propiedad barcode encontrada en el template`);
      htmlBarCode.setAttribute('src', barcode);
    } else {
      this.utilities.log(`propiedad barcode no encontrada en el template`);
    }
    const keys = Object.keys(objectMap);
    let htmlProp;
    // replace demo data
    keys.forEach(key => {
      htmlProp = htmlWrapper.querySelector(`#data-${key}`);
      if (htmlProp) {
        this.utilities.log(`propiedad ${key} encontrada en el template`);
        htmlProp.innerHTML = '';
        spanAux.innerHTML = lpn[key];
        htmlProp.appendChild(spanAux);
      } else {
        this.utilities.log(`propiedad ${key} no encontrada en el template`);
      }
    });

    return htmlWrapper.innerHTML;
  }
  */
  isItem(lpn: any): boolean {
    const exist = Object.keys(Lpn.LpnStateEnum).findIndex(type => {
      return lpn.id.includes(type);
    });
    return exist > -1;
  }

  isRoot(lpn: any): boolean {
    const exist = Object.keys(Lpn.LpnTypeEnum).findIndex(type => {
      return lpn.id.includes(type);
    });
    return !this.isItem(lpn) && exist > -1;
  }

  getIdFromNode(lpn: any): number {
    let id;
    this.utilities.log('getIdFromNode: ', lpn);
    id = lpn.id.replace(/\D/g, '');
    this.utilities.log('getIdFromNode id obtained: ', id);
    return Number(id);
  }

  print(node: any) {
    const idSelectedLpn = this.getIdFromNode(node);
    const observer = {
      next: (result) => {
        if (result.content) {
          this.lpnToPrint = result.content[0];
        } else {
          this.lpnToPrint = result;
        }
        this.utilities.log('lpn obtenido del api: ', this.lpnToPrint);
      },
      error: (error) => {
        this.utilities.error('Error al obtener lpn del api: ', error);
      },
      complete: () => {

      }
    } as Observer<any>;
    if (this.isItem(node)) {
      this.dataProviderService.getLpnItemVO2(idSelectedLpn).subscribe(observer);
    } else if (this.isRoot(node)) {
      this.dataProviderService.getLpn(idSelectedLpn).subscribe(observer);
    }
    this.openPrintDialog();
  }

  openPrintDialog() {
    // this.utilities.log('openPrintDialog() selectedLpn: ', this.lpnToPrint);
    const observer = {
      next: (result) => {
        // this.utilities.log('dialog result:', result);
        // this.utilities.log('this.lpnToPrint: ', this.lpnToPrint);
        if (result && this.lpnToPrint) {
          const jsonTemplate = JSON.parse(result.template.jsonTemplate);
          const htmlContent = this.utilities.generateHtmlLpnContent(this.lpnToPrint, jsonTemplate['gjs-html']);
          const cssStyles = jsonTemplate['gjs-css'];
          const idLpnToPrint = this.lpnToPrint.lpnId ? this.lpnToPrint.lpnId :
          (this.lpnToPrint.lpnItemId ? this.lpnToPrint.lpnItemId : '');
          const size = result.size;
          // this.utilities.log('html to print:', htmlContent);
          // this.utilities.log('css to print:', cssStyles);
          this.utilities.print(`Label LPN ${idLpnToPrint}`, htmlContent, cssStyles,
          size.width, size.heigth);
        } else if (!result) {
          this.utilities.error('Error con los valores seleccionados para imprimir, puede' +
          ' que no se hayan seleccionado valores validos');
        } else if (!this.lpnToPrint) {
          this.utilities.error('Error con el valor del lpn a imprimir, puede' +
          ' que no se haya obtenido resultado del api');
          this.utilities.showSnackBar('Error fetching lpn values', 'OK');
        }
      },
      error: (error) => {
        this.utilities.error('error after closing print label dialog');
        this.utilities.showSnackBar('Error after closing print label dialog', 'OK');
      }
    } as Observer<any>;
    const dialogRef = this.dialog.open(PrintLabelDialogComponent);
    dialogRef.afterClosed().subscribe(observer);
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
    this.utilities.log('loadDataPage() params: ', params);
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

  loadSelectsData() {
    this.selectsData.types = this.dataProviderService.getAllLpnTypes();
    this.selectsData.states = this.dataProviderService.getAllLpnStates();
    this.selectsData.interfaces = this.dataProviderService.getAllLpnInterfaces();
  }

  loadData(useCache = true) {
    this.utilities.log('requesting Lpns');
    this.isLoadingResults = true;
    this.dataSource.loadingSubject.next(true);
    let newData = [];
    let results = [];
    this.selectedLpns = {};
    this.subscriptions.push(this.dataProviderService.getAllLpns().subscribe((res: any) => {
      this.isLoadingResults = false;
      this.dataSource.loadingSubject.next(false);
      // this.utilities.log('lpns received', results);
      if (res) {
        if (res.content && res.content) {
          results = res.content;
        } else {
          results = res;
        }
        newData = this.generateNodes(results);
      }
      // this.utilities.log('newData: ', newData);
      // this.nodes = newData;
      this.dataSource.localData = newData;
      this.loadDataPage();
    }, error => {
      this.isLoadingResults = false;
      this.dataSource.loadingSubject.next(false);
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.loadData(false);
  }

  generate() {
    const dialogRef = this.dialog.open(GenerateLpnIntervalDialogComponent, {
      width: '400px'
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        /*this.dataSource.data.push(result);
        this.refreshTable();*/
        this.reloadData();
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
