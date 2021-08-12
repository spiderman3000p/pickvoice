import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observer, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, retry } from 'rxjs/operators';


@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})

export class TransferDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoadingResults = false;
  subscriptions: Subscription[] = [];
  searchResult = {
    message: '',
    found: false
  };
  targetLpn = null;
  originLpn = null;
  qtyError = false;
  constructor(public dialogRef: MatDialogRef<TransferDialogComponent>,
              private dataProviderService: DataProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // console.log('form controls', formControls);
    this.form = new FormGroup({
      lpnCode: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.min(0), Validators.required])
    });
    this.originLpn = data.lpn;
    this.form.get('lpnCode').valueChanges
    .pipe(tap(val => this.searchResult.message = ''),
    distinctUntilChanged(), debounceTime(500), switchMap(newVal =>
    this.dataProviderService.getLpnItemVO1(`startRow=0;endRow=200;lpnCode-filterType=text;lpnCode-type=equals;lpnCode-filter=${newVal.toLowerCase()};sort-lpnItemId=asc`)))
    .subscribe(result => {
      if (result && result.content && result.content.length > 0) {
        this.targetLpn = result.content[0];
        this.form.get('quantity').setValidators([Validators.max(this.targetLpn.qty)]);
        this.searchResult.message = 'This lpn exists';
        this.searchResult.found = true;
      } else {
        this.targetLpn = null;
        this.searchResult.message = 'This lpn code doesnt exists';
        this.searchResult.found = false;
      }
    }, err => {
      this.utilities.error('Error searching lpn', err);
      this.utilities.showSnackBar('Error searching lpn', 'OK');
    });
    this.form.get('quantity').valueChanges.subscribe(newVal => {
      if (this.targetLpn) {
        this.qtyError = this.targetLpn.qty < newVal;
      }
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('formulario:', this.form.value);
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.transfer();
  }

  executeTransfer() {
    const lpnItem = {
      lpnId: this.targetLpn.lpnId,
      itemId: this.targetLpn.lpnItemId,
      batchNumber: this.targetLpn.batchNumber,
      expiryDate: this.targetLpn.expiryDate,
      createdDate: this.targetLpn.createdDate,
      serial: this.targetLpn.serial,
      weight: this.targetLpn.weight,
      uomId: this.targetLpn.uomId,
      qty: this.form.get('quantity').value,
      inboundDate: this.targetLpn.inboundDate
    };
    this.isLoadingResults = true;
    this.dataProviderService.transferLpn(this.targetLpn.lpnId, [lpnItem])
    .pipe(
      finalize(() => this.isLoadingResults = false),
      retry(3)
    ).subscribe(result => {
      if (result) {
        this.utilities.log('Transfer done succesfully');
        this.utilities.showSnackBar('Transfer done successfully', 'OK');
        this.close(true);
      }
    }, error => {
      this.utilities.error('Error on transfer lpn', error);
      this.utilities.showSnackBar('Error on transfer lpn. Please check internet conection', 'OK');
    });
  }

  transfer() {
    const promptTitle = 'Lpn Item Transfer';
    const promptMessage = 'Are you sure about transfer this LPN item?';
    const observer = {
      next: (result) => {
        if (result) {
          this.executeTransfer();
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

  close(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
