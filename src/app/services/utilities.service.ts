import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private snackBar: MatSnackBar) { }

  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });

    return true;
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
