import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concat, merge, Subscription, fromEvent, Observer, Observable, of } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { IMPORTING_TYPES, ModelMap } from '../models/model-maps.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogComponent } from '../components/common-dialog/common-dialog.component';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
export interface ValidationError {
  error: string;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService implements OnDestroy {
  public dataTypesModelMaps = {
    items: ModelMap.ItemMap,
    itemTypes: ModelMap.ItemTypeMap,
    locations: ModelMap.LocationMap,
    orders: ModelMap.OrderMap,
    uoms: ModelMap.UomMap,
    ordersDto: ModelMap.OrderDtoMap,
    customers: ModelMap.CustomerMap,
    orderTypes: ModelMap.OrderTypeMap,
    sections: ModelMap.SectionMap,
    transports: ModelMap.TransportMap,
    loadPicksDto: ModelMap.LoadPickDtoMap,
    pickPlannings: ModelMap.PickPlanningMap,
    pickTasks: ModelMap.PickTaskMap,
    pickTaskLines: ModelMap.PickTaskLineMap
  };
  subscriptions: Subscription[];
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.subscriptions = [];
  }

  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });

    return true;
  }
  // calcula tiempo transcurrido en segundos desde un timestamp
  public getElapsedTime(timestamp: number) {
    return (new Date().getTime() - timestamp) / 1000;
  }

  renderColumnData(type: string, data: any) {
    let dataValue = '';
    if (data !== undefined && data !== null) {
      switch (type) {
        case 'date':
          let date;
          if (typeof data === 'number') {
            // esta conversion sale de aqui: https://github.com/SheetJS/sheetjs/issues/1623
            date = 1000 * 60 * 60 * 24 * (data - 25569);
            dataValue = moment(date).format('YYYY-MM-DD');
          } else if (typeof data === 'object') {
            dataValue = moment(data).format('YYYY-MM-DD');
          } else {
            dataValue = data;
          }
          // dataValue = date;
          break;
        case IMPORTING_TYPES.TASK_TYPES: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.ITEMS: dataValue = data && data.description ? data.description : ''; break;
        case IMPORTING_TYPES.USERS: dataValue = data ? `${data.firstName} ${data.lastName}` : ''; break;
        case IMPORTING_TYPES.ORDERS: dataValue = data && data.orderNumber ? data.orderNumber : ''; break;
        case IMPORTING_TYPES.ITEM_TYPE: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.UOMS: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.SECTIONS: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.TRANSPORTS: dataValue = data && data.nameRoute ? data.nameRoute : ''; break;
        case IMPORTING_TYPES.CUSTOMERS: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.ORDER_TYPE: dataValue = data && data.description ? data.description : ''; break;
        case IMPORTING_TYPES.ORDER_LINE: dataValue = data && data.length ? `${data.length} orders` : 'none'; break;
        default: dataValue = data;
      }
    }
    return dataValue;
  }

  getSelectIndexValue(definitions: any, data: any, key: string) {
    // this.utilities.log(`${key} on data select display`, data);
    return (definitions[key].formControl.control === 'select' ?
    (definitions[key].formControl.valueIndex !== null && data[definitions[key].formControl.valueIndex] !== undefined ?
    data[definitions[key].formControl.valueIndex] : data) : data);
  }

  getSelectDisplayData(definitions: any, data: any, key: string) {
    // console.log(`${key} on data select display`, data);
    return (definitions[key].formControl.control === 'select' ?
    (definitions[key].formControl.displayIndex !== null && data[definitions[key].formControl.displayIndex] !== undefined ?
    data[definitions[key].formControl.displayIndex] : data) : data);
  }

  equalArrays(array1: any[], array2: any[]) {
    /*this.log('comparando array1', array1);
    this.log('con array2', array2);*/

    if (array1.length !== array2.length) {
      this.error(`los array no son de igual tamaño array 1: ${array1.length}, array 2: ${array2.length}`);
      return false;
    }
    for (const element of array1) {
      if (!array2.includes(element)) {
        this.error('hay un elemento en el array1 que no esta en el array2', element);
        return false;
      }
    }
    return true;
  }

  parseDate(date: any): string {
    return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
  }

  public showCommonDialog(observer: Observer<any>, options?: any) {
    const dialogRef = this.dialog.open(CommonDialogComponent,
    {
      data: {
        title: options.title,
        message: options.message,
        positiveBtnText: options.positiveBtnText,
        negativeBtnText: options.negativeBtnText,
        positiveBtnCallback: options.positiveBtnCallback,
        negativeBtnCallback: options.negativeBtnCallback,
        showPositiveBtn: options.showPositiveBtn,
        showNegativeBtn: options.showNegativeBtn
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(observer));
  }

  getJsonFromObject(object: any, type: string): any {
    const dataMap = this.dataTypesModelMaps[type];
    const toExport = {};
    // this.log('parseando objeto', object);
    if (dataMap && object) {
      for (const key in dataMap) {
        if (object[key]) {
          if (dataMap[key].formControl.control !== 'select' && dataMap[key].formControl.control !== 'table') {
            toExport[key] = object[key];
          } else if (dataMap[key].formControl.control === 'select') {
            // this.log('parseando objeto', object[key]);
            // this.log('formControl de mapa de objeto', dataMap[key].formControl);
            // this.log('objeto con indice', object[key][dataMap[key].formControl.valueIndex]);
            toExport[key] = dataMap[key].formControl.valueIndex === null ? object[key] :
            object[key][dataMap[key].formControl.valueIndex];
          }
        }
      }
      // this.log('objeto parseado', toExport);
      return toExport;
    }
    return null;
  }

  objectToRow(object: any, type: string): any {
    const dataMap = this.dataTypesModelMaps[type];
    const toExport = {};
    if (dataMap) {
      for (const key in dataMap) {
        if (dataMap[key].formControl.control !== 'select' && dataMap[key].formControl.control !== 'table') {
          toExport[key] = object[key];
        } else if (dataMap[key].formControl.control === 'select') {
          toExport[key] = dataMap[key].formControl.displayIndex === null ? object[key] :
          object[key][dataMap[key].formControl.displayIndex];
        }
      }
      return toExport;
    }
    return null;
  }

  public log(param1: any, param2?: any) {
    if (environment.debug === true) {
      console.log(param1, param2 ? param2 : '');
    }
  }

  public error(param1: any, param2?: any) {
    if (environment.debug === true) {
      console.error(param1, param2 ? param2 : '');
    }
  }

  exportToXlsx(data: any | any[], title: string) {
    this.log('exporting data to xlsx file', data);
    if (data !== undefined) {
      /* generate worksheet */
      let rows = [];
      if (typeof data === 'object' && !Array.isArray(data)) {
        rows.push(data);
      } else if (typeof Array.isArray(data)) {
        rows = data;
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, `${title}.xlsx`);
    }
  }

  print(htmlElementId: string): boolean {
    let printContents;
    let popupWin;
    printContents = document.getElementById(htmlElementId).innerHTML;
    this.log('printContent', printContents);
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
    return true;
  }

  internetStatus(): Observable<Event> {
    const offlineEvent = fromEvent(window, 'offline');
    const onlineEvent = fromEvent(window, 'online');
    return merge(onlineEvent, offlineEvent);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
