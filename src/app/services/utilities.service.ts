import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { ModelMap } from '../models/model-maps.model';

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
    locations: ModelMap.LocationMap,
    orders: ModelMap.OrderMap
  };
  constructor(private snackBar: MatSnackBar) { }

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
        } else {
          dataValue = data;
        }
        break;
      case 'itemType': dataValue = data.code; break;
      case 'itemUom': dataValue = data.code; break;
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
}
