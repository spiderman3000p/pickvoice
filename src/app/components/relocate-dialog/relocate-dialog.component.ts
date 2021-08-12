import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Observer, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, retry } from 'rxjs/operators';


@Component({
  selector: 'app-relocate-dialog',
  templateUrl: './relocate-dialog.component.html',
  styleUrls: ['./relocate-dialog.component.scss']
})

export class RelocateDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoadingResults = false;
  subscriptions: Subscription[] = [];
  searchResult = {
    message: '',
    found: false
  };
  targetLocation = null;
  relocateParams = {
    itemId: null,
    lpnId: null,
    qty: null
  };
  locationTypes: Observable<string[]>;
  lpnId: number;
  constructor(public dialogRef: MatDialogRef<RelocateDialogComponent>,
              private dataProviderService: DataProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    // console.log('form controls', formControls);
    this.lpnId = this.data.lpnId;
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });
    this.utilities.log('lpn id received', this.lpnId);
    this.form.get('code').valueChanges
    .pipe(tap(val => this.searchResult.message = ''),
    distinctUntilChanged(), debounceTime(500), switchMap(newVal =>
    this.dataProviderService.getAllLpnVO3(`startRow=0;endRow=200;locationType-filterType=text;locationType-type=equals;locationType-filter=${this.form.get('type').value.toLowerCase()};locationCode-filterType=text;locationCode-type=equals;locationCode-filter=${newVal.toLowerCase()}`)))
    .subscribe(result => {
      if (result && result.content && result.content.length > 0) {
        this.targetLocation = result.content[0];
        this.searchResult.message = 'This location exists';
        this.searchResult.found = true;
      } else {
        this.targetLocation = null;
        this.searchResult.message = 'This location doesnt exists';
        this.searchResult.found = false;
      }
    }, err => {
      this.utilities.error('Error searching location', err);
      this.utilities.showSnackBar('Error searching location', 'OK');
    });
    this.form.get('type').valueChanges.pipe(tap(val => this.searchResult.message = ''),
    distinctUntilChanged(), switchMap(newVal =>
    this.dataProviderService.getAllLpnVO3(`startRow=0;endRow=200;locationType-filterType=text;locationType-type=equals;locationType-filter=${newVal.toLowerCase()};locationCode-filterType=text;locationCode-type=equals;locationCode-filter=${this.form.get('code').value.toLowerCase()}`)))
    .subscribe(result => {
      if (result && result.content && result.content.length > 0) {
        this.targetLocation = result.content[0];
        this.searchResult.message = 'This location exists';
        this.searchResult.found = true;
      } else {
        this.targetLocation = null;
        this.searchResult.message = 'This location doesnt exists';
        this.searchResult.found = false;
      }
    }, err => {
      this.utilities.error('Error searching location', err);
      this.utilities.showSnackBar('Error searching location', 'OK');
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }

    if (!this.targetLocation) {
      this.utilities.error('target location invalid');
      this.utilities.showSnackBar('Please select a target location first', 'OK');
      return;
    }
    this.relocate();
  }

  executeRelocate() {
    this.isLoadingResults = true;
    this.dataProviderService.relocateLpn(this.lpnId, this.targetLocation.locationid)
    .pipe(
      finalize(() => this.isLoadingResults = false),
      retry(3)
    ).subscribe(result => {
      if (result) {
        this.utilities.log('Relocation done succesfully');
        this.utilities.showSnackBar('Relocation done successfully', 'OK');
        this.close(this.targetLocation.locationId);
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

  relocate() {
    const promptTitle = 'Lpn Relocate';
    const promptMessage = 'Are you sure about relocate this LPN?';
    const observer = {
      next: (result) => {
        if (result) {
          this.executeRelocate();
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

  close(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit(): void {
    this.locationTypes =  this.dataProviderService.getAllLocationTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
