import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { ModelMap } from '../../models/model-maps.model';

import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, retry, finalize, tap } from 'rxjs/operators';
import { Observable, Observer, Subscription } from 'rxjs';

import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lpn-relocate',
  templateUrl: './lpn-relocate.component.html',
  styleUrls: ['./lpn-relocate.component.css']
})
export class LpnRelocateComponent implements OnInit {
  searchOriginLpnForm: FormGroup;
  searchDestLocationForm: FormGroup;
  isLoadingLpnsDest = false;
  isLoadingLpnOrigin = false;
  isLoadingResults = false;
  lpnsOrigin = [];
  lpnsDest = [];
  locationIdDest: number;
  locationTypes: Observable<any[]>;
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService , private activatedRoute: ActivatedRoute) {
      this.searchOriginLpnForm = new FormGroup({
        code: new FormControl('', [Validators.required])
      });
      this.searchDestLocationForm = new FormGroup({
        type: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required])
      });
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.activatedRoute.data.pipe(
      finalize(() => this.isLoadingResults = false)
    ).subscribe((data: {
      data: any
    }) => {
      this.isLoadingResults = false;
      this.utilities.log('resolved data: ', data.data);
      if (data && data.data && data.data.types) {
        this.locationTypes = data.data.types;
      }
      if (data && data.data && data.data.lpns) {
        this.isLoadingLpnOrigin = true;
        data.data.lpns.pipe(
          tap((results: any) => results.content.map(element => element.draggable = true)))
          .subscribe(results => {
            this.isLoadingLpnOrigin = false;
            this.lpnsOrigin = results.content;
        }, error => {
          this.isLoadingLpnOrigin = false;
          this.utilities.error('Error fetching initial origin lpns');
        });
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error fetching location types');
    });
  }

  getSelectedLpns(): number {
    // return this.lpnItemsOrigin.filter(element => element.qtyToTransfer > 0).length;
    return null;
  }

  excuteBulkRelocate() {

  }

  isValidRelocate(lpn: any): boolean {
    if (this.locationIdDest === undefined) {
      this.utilities.error('No hay un location destino seleccionado');
      this.utilities.showSnackBar('You have not selected a target location. Please check and try again', 'OK');
      return false;
    }
    return true;
  }

  executeRelocate(lpn: any, event?: any) {
    if (!this.isValidRelocate(lpn)) {
      return;
    }
    this.utilities.log('lpn to relocate: ', lpn);
    // this.isLoadingResults = true;
    this.dataProviderService.relocateLpn(lpn.lpnId, this.locationIdDest)
    .pipe(
      finalize(() => this.isLoadingResults = false),
      retry(3)
    ).subscribe(result => {
      if (result) {
        this.utilities.log('Relocation done succesfully');
        this.utilities.showSnackBar('Relocation done successfully', 'OK');
        if (event) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        }
        // this.searchLocationDest();
      }
    }, error => {
      this.utilities.error('Error on relocate lpn', error);
      if (error.error && error.error.message) {
        this.utilities.showSnackBar('Error on relocate lpn: ' + error.error.message, 'OK');
      } else {
        this.utilities.showSnackBar('Error on relocate lpn. Please check internet conection', 'OK');
      }
    });
  }

  searchLpnOrigin() {
    if (!this.searchOriginLpnForm.valid) {
      this.utilities.showSnackBar('Please enter a code to search', 'OK');
      return;
    }
    const lpnCode = this.searchOriginLpnForm.value.code;
    this.utilities.log('searching ' + lpnCode);
    const params = `startRow=0;endRow=200;code-filterType=text;code-type=equals;` +
    `code-filter=${lpnCode.toLowerCase()}`;
    this.isLoadingLpnOrigin = true;
    this.dataProviderService.getAllLpnVO3(params).
    pipe(
      retry(3),
      tap((results: any) => results.content.map(element => element.draggable = true)),
      finalize(() => this.isLoadingLpnOrigin = false)
    ).subscribe((results: any) => {
      if (results && results.content) {
        this.lpnsOrigin = results.content;
      } else if (results) {
        this.lpnsOrigin = results;
      }
      if (this.lpnsOrigin.length === 0) {
        this.utilities.log('No se encontro LPN ' + lpnCode);
        this.utilities.showSnackBar('No elements found for LPN code ' + lpnCode, 'OK');
      }
    }, error => {
      this.utilities.error('Error al cargar lpns origen', error);
      this.utilities.showSnackBar('Error fetching lpns', 'OK');
    });
  }

  searchLocationDest() {
    if (!this.searchDestLocationForm.valid) {
      this.utilities.showSnackBar('Please select a type and a code to search', 'OK');
      return;
    }
    const locationCode = this.searchDestLocationForm.value.code;
    const locationType = this.searchDestLocationForm.value.type;
    this.utilities.log('searching ' + locationCode);
    const params = `startRow=0;endRow=200;` +
    `locationType-filterType=text;locationType-type=equals;` +
    `locationType-filter=${locationType.toLowerCase()};` +
    `locationCode-filterType=text;locationCode-type=equals;` +
    `locationCode-filter=${locationCode.toLowerCase()}`;
    this.isLoadingLpnsDest = true;
    this.dataProviderService.getAllLpnVO3(params).pipe(
      retry(3),
      finalize(() => this.isLoadingLpnsDest = false)
    ).subscribe((results: any) => {
      if (results && results.content) {
        this.lpnsDest = results.content;
      } else if (results) {
        this.lpnsDest = results;
      }
      if (this.lpnsDest.length === 0) {
        this.locationIdDest = undefined;
        this.utilities.log('No se encontro target location ' + locationCode);
        this.utilities.showSnackBar('No elements found for target location code ' + locationCode, 'OK');
      } else {
        this.locationIdDest = this.lpnsDest[0].locationid; // TODO: corregir el campo locationId
        this.utilities.log('locationIdDest: ', this.locationIdDest);
      }
    }, error => {
      this.utilities.error('Error al cargar lpns de location destino', error);
      this.utilities.showSnackBar('Error fetching target location lpns', 'OK');
    });
  }

  relocate(lpn?: any, event?: any) {
    if (!this.isValidRelocate(lpn)) {
      return;
    }
    let promptTitle = '';
    let promptMessage = '';
    if (lpn) {
      promptTitle = 'Lpn Relocate';
      promptMessage = 'Are you sure about relocate this LPN?';
    } else {
      promptTitle = 'Lpn Bulk Relocate';
      promptMessage = 'Are you sure about relocate these LPNs?';
    }
    const observer = {
      next: (result) => {
        if (result) {
          if (lpn) {
            this.executeRelocate(lpn, event);
          } else {
            this.excuteBulkRelocate();
          }
        }
      },
      error: (error) => {
        this.utilities.error('Error on finish prompt');
      }
    } as Observer<boolean>;
    this.relocatePrompt(observer, promptTitle, promptMessage);
  }

  relocatePrompt(observer: Observer<any>, mTitle: string, mMessage: string) {
    this.utilities.showCommonDialog(observer, {
      title: mTitle,
      message: mMessage
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  originPredicate(item: CdkDrag<any>) {
    return item.data.draggable;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  targetPredicate(item: CdkDrag<any>) {
    return false;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      /*if (!this.isValidRelocate(lpn)) {
        return;
      }
      let promptTitle = '';
      let promptMessage = '';
      if (lpn) {
        promptTitle = 'Lpn Relocate';
        promptMessage = 'Are you sure about relocate this LPN?';
      } else {
        promptTitle = 'Lpn Bulk Relocate';
        promptMessage = 'Are you sure about relocate these LPNs?';
      }
      const observer = {
        next: (result) => {
          if (result) {
            if (lpn) {
              this.executeRelocate(lpn);
            } else {
              this.excuteBulkRelocate();
            }
          }
        },
        error: (error) => {
          this.utilities.error('Error on finish prompt');
        }
      } as Observer<boolean>;*/
      // this.relocatePrompt(observer, promptTitle, promptMessage);
      this.utilities.log('on drop data: ', event.container.data);
      this.relocate(event.container.data[0], event);
    }
  }
}
