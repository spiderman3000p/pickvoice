import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observer, Observable, of } from 'rxjs';
import { ModelMap } from '../models/model-maps.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogComponent } from '../components/common-dialog/common-dialog.component';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';

export interface ValidationError {
  error: string;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  public dataTypesModelMaps = {
    items: ModelMap.ItemMap,
    itemTypes: ModelMap.ItemTypeMap,
    locations: ModelMap.LocationMap,
    orders: ModelMap.OrderMap,
    uoms: ModelMap.UomMap,
    ordersDto: ModelMap.OrderDtoMap
  };
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });

    return true;
  }

  renderColumnData(type: string, data: any) {
    let dataValue;
    switch (type) {
      case 'date':
        if (typeof data === 'string') {
          if (data.length > 0) {
            dataValue = new Intl.DateTimeFormat('en-US').format(new Date(data));
          } else {
            dataValue = new Intl.DateTimeFormat('en-US').format(new Date());
          }
        } else if (typeof data === 'number') {
          // esta conversion sale de aqui: https://github.com/SheetJS/sheetjs/issues/1623
          dataValue = new Date(1000 * 60 * 60 * 24 * (data - 25569));
        } else if (typeof data === 'object') {
          dataValue = data;
        } else {
          dataValue = data;
        }
        break;
      case 'itemType': dataValue = data.code; break;
      case 'itemUom': dataValue = data.code; break;
      case 'section': dataValue = data.code; break;
      case 'transport': dataValue = data.nameRoute; break;
      case 'customer': dataValue = data.name; break;
      case 'orderType': dataValue = data.code; break;
      default: dataValue = data;
    }
    return dataValue;
  }

  equalArrays(array1: any[], array2: any[]) {
    console.log('comparando array1', array1);
    console.log('con array2', array2);

    if (array1.length !== array2.length) {
      console.error(`los array no son de igual tamaño array 1: ${array1.length}, array 2: ${array2.length}`);
      return false;
    }
    for (const element of array1) {
      if (!array2.includes(element)) {
        console.error('hay un elemento en el array1 que noesta en el array2', element);
        return false;
      }
    }
    return true;
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
    dialogRef.afterClosed().subscribe(observer);
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
    console.log('exporting data to xlsx file', data);
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
    console.log('printContent', printContents);
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
}
