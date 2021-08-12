import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';

import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { retry, finalize, tap } from 'rxjs/operators';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-lpn-transfer',
  templateUrl: './lpn-transfer.component.html',
  styleUrls: ['./lpn-transfer.component.css']
})
export class LpnTransferComponent implements OnInit {
  searchOriginLpnForm: FormGroup;
  searchDestLpnForm: FormGroup;
  isLoadingLpnDest = false;
  isLoadingLpnOrigin = false;
  isLoadingResults = false;
  lpnItemsOrigin = [];
  lpnItemsDest = [];
  lpnIdDest: number;
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService) {
      this.searchOriginLpnForm = new FormGroup({
        code: new FormControl('', [Validators.required])
      });
      this.searchDestLpnForm = new FormGroup({
        code: new FormControl('', [Validators.required])
      });
  }

  ngOnInit() {
  }

  getSelectedLpns(): number {
    return this.lpnItemsOrigin.filter(element => element.qtyToTransfer > 0).length;
  }

  excuteBulkTransfer() {

  }

  isValidTransfer(lpn: any): boolean {
    if (!(lpn.qtyToTransfer > 0 && lpn.qty - lpn.qtyToTransfer >= 0)) {
      this.utilities.error('Cantidad a transferir invalida');
      this.utilities.showSnackBar('Qty to transfer invalid. Please check and try again', 'OK');
      return false;
    }
    if (!this.lpnIdDest) {
      this.utilities.error('No hay un Lpn destino seleccionado');
      this.utilities.showSnackBar('You have not selected a target LPN. Please check and try again', 'OK');
      return false;
    }
    return true;
  }

  executeTransfer(lpn: any) {
    if (!this.isValidTransfer(lpn)) {
      return;
    }
    const lpnItem = {
      lpnId: lpn.lpnId,
      lpnItemId: lpn.lpnItemId,
      batchNumber: lpn.batchNumber,
      expiryDate: lpn.expiryDate,
      createdDate: lpn.createdDate,
      serial: lpn.serial,
      weight: lpn.weight,
      uomId: lpn.uomId,
      qty: lpn.qtyToTransfer,
      inboundDate: lpn.inboundDate
    };
    this.isLoadingResults = true;
    this.dataProviderService.transferLpn(this.lpnIdDest, [lpnItem])
    .pipe(
      finalize(() => this.isLoadingResults = false),
      retry(3)
    ).subscribe(result => {
      if (result) {
        lpn.qtyToTransfer = 0;
        this.utilities.log('Transfer done succesfully');
        this.utilities.showSnackBar('Transfer done successfully', 'OK');
        this.searchLpnDest();
      }
    }, error => {
      const errorMessage = error.error.message ? error.error.message : 'Error on transfer lpn.';
      this.utilities.error('Error on transfer lpn', error);
      this.utilities.showSnackBar(errorMessage, 'OK');
    });
  }

  searchLpnOrigin() {
    if (!this.searchOriginLpnForm.valid) {
      this.utilities.showSnackBar('Please enter a code to search', 'OK');
      return;
    }
    const lpnCode = this.searchOriginLpnForm.value.code;
    this.utilities.log('searching ' + lpnCode);
    const params = `startRow=0;endRow=200;lpnCode-filterType=text;lpnCode-type=equals;` +
    `lpnCode-filter=${lpnCode.toLowerCase()};sort-lpnItemId=asc`;
    this.isLoadingLpnOrigin = true;
    this.dataProviderService.getLpnItemVO1(params).pipe(
      retry(3),
      tap(results => results.content.map(element => element.qtyToTransfer = 0)),
      finalize(() => this.isLoadingLpnOrigin = false)
    ).subscribe((results: any) => {
      if (results && results.content) {
        this.lpnItemsOrigin = results.content;
      } else if (results) {
        this.lpnItemsOrigin = results;
      }
      if (this.lpnItemsOrigin.length === 0) {
        this.utilities.log('No se encontro LPN ' + lpnCode);
        this.utilities.showSnackBar('No elements found for LPN code ' + lpnCode, 'OK');
      }
    }, error => {
      this.utilities.error('Error al cargar lpns origen', error);
      this.utilities.showSnackBar('Error fetching lpns', 'OK');
    });
  }

  searchLpnDest() {
    if (!this.searchDestLpnForm.valid) {
      this.utilities.showSnackBar('Please enter a code to search', 'OK');
      return;
    }
    const lpnCode = this.searchDestLpnForm.value.code;
    this.utilities.log('searching ' + lpnCode);
    const params = `startRow=0;endRow=200;lpnCode-filterType=text;lpnCode-type=equals;` +
    `lpnCode-filter=${lpnCode.toLowerCase()};sort-lpnItemId=asc`;
    this.isLoadingLpnDest = true;
    this.dataProviderService.getLpnItemVO1(params).pipe(
      retry(3),
      finalize(() => this.isLoadingLpnDest = false)
    ).subscribe((results: any) => {
      if (results && results.content) {
        this.lpnItemsDest = results.content;
      } else if (results) {
        this.lpnItemsDest = results;
      }
      if (this.lpnItemsDest.length === 0) {
        this.utilities.log('No se encontro target LPN ' + lpnCode);
        this.utilities.showSnackBar('No elements found for target LPN code ' + lpnCode, 'OK');
      } else {
        this.lpnIdDest = this.lpnItemsDest[0].lpnId;
      }
    }, error => {
      this.utilities.error('Error al cargar lpn destino', error);
      this.utilities.showSnackBar('Error fetching target lpn', 'OK');
    });
  }

  transfer(lpn?: any) {
    if (!this.isValidTransfer(lpn)) {
      return;
    }
    let promptTitle = '';
    let promptMessage = '';
    if (lpn) {
      promptTitle = 'Lpn Transfer';
      promptMessage = 'Are you sure about transfer this LPN item?';
    } else {
      promptTitle = 'Lpn Bulk Transfer';
      promptMessage = 'Are you sure about transfer these LPN items?';
    }
    const observer = {
      next: (result) => {
        if (result) {
          if (lpn) {
            this.executeTransfer(lpn);
          } else {
            this.excuteBulkTransfer();
          }
        }
      },
      error: (error) => {
        this.utilities.error('Error on finish prompt');
      }
    } as Observer<boolean>;
    this.transferPrompt(observer, promptTitle, promptMessage);
  }

  transferPrompt(observer: Observer<any>, mTitle: string, mMessage: string) {
    this.utilities.showCommonDialog(observer, {
      title: mTitle,
      message: mMessage
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }
}
