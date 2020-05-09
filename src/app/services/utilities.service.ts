import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concat, merge, Subscription, fromEvent, Observer, Observable, of } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { STATES, IMPORTING_TYPES, ModelMap } from '../models/model-maps.model';
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
declare var JsBarcode: any;

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService implements OnDestroy {
  public dataTypesModelMaps = {
    items: ModelMap.ItemMap,
    itemsDto: ModelMap.LoadItemDtoMap,
    itemUoms: ModelMap.ItemUomMap,
    itemUomsDto: ModelMap.LoadItemUomDtoMap,
    itemTypes: ModelMap.ItemTypeMap,
    qualityStates: ModelMap.QualityStateMap,
    locations: ModelMap.LocationMap,
    locationsDto: ModelMap.LoadLocationDtoMap,
    orders: ModelMap.OrderMap,
    uoms: ModelMap.UomMap,
    ordersDto: ModelMap.LoadOrderDtoMap,
    customers: ModelMap.CustomerMap,
    orderTypes: ModelMap.OrderTypeMap,
    sections: ModelMap.SectionMap,
    transports: ModelMap.TransportMap,
    loadPicksDto: ModelMap.LoadPickDtoMap,
    pickPlannings: ModelMap.PickPlanningMap,
    pickTasks: ModelMap.PickTaskMap,
    pickTaskLines: ModelMap.PickTaskLineMap,
    docks: ModelMap.DockMap
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

  generateBarCode(input: string) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, input, { height: 30, fontSize: 10});
    const base64 = canvas.toDataURL('image/jpg');
    this.log('base64 bar code', base64);
    return base64;
  }

  generateTaskPdfContent(object: any, tableContent: any[]): Observable<any> {
    let base64Logo;
    let canvas;
    let content;
    const dateNow = new Date();
    const image = new Image();
    canvas = document.createElement('canvas');
    canvas.style.height = 50 + 'px';
    const response = new Observable(suscriber => {
      image.onload = () => {
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        base64Logo = canvas.toDataURL('image/png');
        content.images.logo = base64Logo;
        suscriber.next(content);
        suscriber.complete();
      };
    });
    content = {
      content: [
        {
          margin: [0, 0, 0, 10],
          alignment: 'left',
          columns: [
            {
              width: 80,
              image: 'logo',
              margin: [0, 0, 10, 0]
            },
            [
              {
                margin: [20, 20, 0, 0],
                text: `TASK # ${object.id} (${object.taskState})`,
                style: 'h1'
              },
              {
                margin: [20, 0, 0, 0],
                text: `Type: ${object.taskType.name} - Priority: ${STATES[object.priority]}`,
                style: 'h3'
              },
              {
                margin: [20, 0, 0, 0],
                text: `Description: ${object.description}`
              }
            ],
            [
              {
                alignment: 'right',
                image: this.generateBarCode(object.id)
              }
            ]
          ]
        },
        {
          margin: [0, 0, 0, 20],
          columns: [
            {
              layout: 'noBorders',
              margin: [0, 0, 0, 5],
              alignment: 'left',
              table: {
                widths: ['auto', '*'],
                headerRows: 0,
                body: [
                  [
                    { text: `Document`, style: 'tableHeader2' },
                    `${object.document}`
                  ],
                  [
                    { text: `Enable Date`, style: 'tableHeader2'},
                    `${object.enableDate}`
                  ],
                  [
                    { text: `Date`, style: 'tableHeader2'},
                    `${object.date}`
                  ],
                  [
                    { text: `Assignment Date`, style: 'tableHeader2' },
                    `${object.dateAssignment}`
                  ],
                  [
                    { text: `User`, style: 'tableHeader2' },
                    ` ${object.user ? object.user.firstName : ''} ${object.user ?
                      object.user.lastName : ''} ${object.user ? '(' + object.user.userName + ')' : ''}`
                  ],
                  [
                    { text: 'Quantity', style: 'tableHeader2' },
                      ` ${object.qty}`
                  ],
                  [
                    { text: 'Lines', style: 'tableHeader2' },
                    `${object.lines}`
                  ]
                ]
              }
            },
            {
              alignment: 'left',
              layout: 'noBorders',
              margin: [5, 0, 0, 0],
              table: {
                widths: ['auto', '*'],
                headerRows: 0,
                body: [
                  [
                    { text: `Current Line`, style: 'tableHeader2' },
                    `${object.currentLine}`
                  ],
                  [
                    { text: `Children Work`, style: 'tableHeader2' },
                    `${object.childrenWork}`
                  ],
                  [
                    { text: `Rule executed`, style: 'tableHeader2' },
                    `${object.ruleExecuted}`
                  ],
                  [
                    { text: `Validate Location`, style: 'tableHeader2' },
                    `${object.validateLocation ? 'Yes' : 'No' }`
                  ],
                  [
                    { text: `Pallet Complete`, style: 'tableHeader2' },
                    `${object.palletComplete ? 'Yes' : 'No' }`
                  ],
                  [
                    { text: `Validate Lpn`, style: 'tableHeader2' },
                    `${object.validateLpn ? 'Yes' : 'No' }`
                  ],
                  [
                    { text: `Validate Sku`, style: 'tableHeader2' },
                    `${object.validateSku ? 'Yes' : 'No' }`
                  ]
                ]
              }
            }
          ]
        },
        {
          table: {
            borderColor: 'darkgrey',
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: [
              [
                {text: 'Line', style: 'tableHeader', alignment: 'center'},
                {text: 'Sku', style: 'tableHeader', alignment: 'center'},
                {text: 'Sku Description', style: 'tableHeader', alignment: 'center'},
                {text: 'Batch', style: 'tableHeader', alignment: 'center'},
                {text: 'Serial', style: 'tableHeader', alignment: 'center'},
                {text: 'Location', style: 'tableHeader', alignment: 'center'},
                {text: 'Expiry Date', style: 'tableHeader', alignment: 'center'},
                {text: 'Uom Code', style: 'tableHeader', alignment: 'center'},
                {text: 'Lpn Code', style: 'tableHeader', alignment: 'center'},
                /* {text: 'Scanned Verification', style: 'tableHeader', alignment: 'center'},*/
                {text: 'Qty To Picked', style: 'tableHeader', alignment: 'center'}
              ]
            ]
          }
        }
      ],
      styles: {
        h1: {
          fontSize: '18',
          bold: true
        },
        h2: {
          fontSize: '14',
          bold: true
        },
        small: {
          fontSize: '10'
        },
        normal: {
          fontSize: '11'
        },
        medium: {
          fontSize: '12'
        },
        tableHeader: {
          color: 'white',
          bold: true,
          fillColor: 'darkgrey',
          fontSize: '8'
        },
        tableHeader2: {
          bold: true,
          fontSize: 8
        },
        tableRow: {
          fontSize: 8
        },
        invisible: {
          opacity: 0,
        }
      },
      defaultStyle: {
        fontSize: '8',
        bold: true
      },
      images: {
        // logo: img.src
        // logo: base64Logo
        logo: base64Logo
      },
      footer: function(currentPage, pageCount) {
        return {
          alignment: 'right',
          margin: [0, 0, 20, 0],
          text: 'Page' + currentPage.toString() + ' of ' + pageCount
        };
      },
      header: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [{
          text: 'Date: ' + dateNow.toLocaleDateString(),
          alignment: 'right',
          margin: [0, 20, 20, 0]
        },];
      },
    };
    tableContent.forEach(row => {
      row.style = 'tableRow';
      content.content[2].table.body.push(row);
    });
    image.src = '/assets/images/logo.png';
    return response;
  }

  renderColumnData(type: string, data: any) {
    let dataValue = data;

    if (data !== undefined && data !== null && (typeof data === 'object' ||
      (type === 'date' && typeof data === 'number'))) {
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
        case IMPORTING_TYPES.QUALITY_STATE_TYPES: dataValue = data && data.name ? data.name : ''; break;
        case IMPORTING_TYPES.ORDER_LINE: dataValue = data && data.length ? `${data.length} orders` : 'none'; break;
        default: dataValue = data;
      }
    }
    return dataValue;
  }

  getSelectIndexValue(definitions: any, data: any, key: string) {
    // this.log(`${key} on data select display`, data);
    return (definitions[key].formControl.control === 'select' ?
    (definitions[key].formControl.valueIndex !== null && data[definitions[key].formControl.valueIndex] !== undefined ?
    data[definitions[key].formControl.valueIndex] : data) : data);
  }

  getSelectDisplayData(definitions: any, data: any, key: string) {
    // this.log(`${key} on data select display`, data);
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

  formatDate(date: Date, format?: string): string {
    format = format ? format : 'YYYY-MM-DD';
    return moment(date).format(format);
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
