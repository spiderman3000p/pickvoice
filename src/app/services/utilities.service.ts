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
    return data && type && type === 'date' ? new Intl.DateTimeFormat('en-US').format(data) :  data;
  }

  equalArrays(array1: any[], array2: any[]) {
    let equals = true;
    array1.forEach((element1, index1) => {
      if (!equals) {
        return;
      }
      if (array1[index1] !== array2[index1]) {
        equals = false;
      }
    });

    return array1.length === array2.length && equals;
  }
}
