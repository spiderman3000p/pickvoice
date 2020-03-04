import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observer, Observable, of } from 'rxjs';
import { ModelMap } from '../models/model-maps.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogComponent } from '../components/common-dialog/common-dialog.component';
import { environment } from '../../environments/environment';

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
    orders: ModelMap.OrderMap
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
          dataValue = new Intl.DateTimeFormat('en-US').format(new Date(data));
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
      case 'transport': dataValue = data.transportNumber; break;
      default: dataValue = data;
    }
    return dataValue;
  }

  equalArrays(array1: any[], array2: any[]) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (const element of array1) {
      if (!array2.includes(element)) {
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
}
