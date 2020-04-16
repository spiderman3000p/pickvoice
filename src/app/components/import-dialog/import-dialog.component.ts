import { OnDestroy, Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnDestroy {
  importType: string;
  fileInput: FormControl;
  urlInput: FormControl;
  // apiType: FormControl;
  file: File;
  parsedData: any;
  isLoadingResults = false;
  dialogTitle = '';
  subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<ImportDialogComponent>, private sharedDataService: SharedDataService,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
              private httpClient: HttpClient, private router: Router) {
    this.file = {} as File;
    this.importType = this.data.type;

    if (this.importType === 'csv') {
      this.fileInput = new FormControl('', Validators.required);
      this.dialogTitle = 'Import File';
    }
    if (this.importType === 'url') {
      this.urlInput = new FormControl('', Validators.required);
      this.dialogTitle = 'Import Url';
    }
    if (this.importType === 'api') {
      this.urlInput = new FormControl('', Validators.required);
      // this.apiType = new FormControl('', Validators.required);
      this.dialogTitle = 'Import Api';
    }
  }

  validateFile(files: FileList) {
    this.file = files[0];
    this.utilities.log('file', this.file);
    this.utilities.log('file size', this.file.size);
    this.utilities.log('file type', this.file.type);
    if (this.file.size > (5 * 1024 * 1024)) {
      this.utilities.showSnackBar('The file size is bigger than 5MB', 'OK');
    }
    if (this.file.type !== 'text/csv' && this.file.type !== 'application/vnd.ms-excel'
      && this.file.type !== 'application/csv' && this.file.type !== 'application/x-csv'
      && this.file.type !== 'text/x-csv' && this.file.type !== 'text/plain'
      && this.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.utilities.showSnackBar('The file format is invalid', 'OK');
    }
  }

  loadUrl() {
    this.isLoadingResults = true;
    this.subscriptions.push(this.httpClient.get(this.urlInput.value, { responseType: 'blob'}).pipe(
      tap(
        data => {
          this.utilities.log('data', data);
        },
        error => {
          this.utilities.error('error', error);
        }
      )
    ).subscribe(result => {
      this.utilities.log('resultado obtenido', result);
      this.utilities.log('tipo', typeof result);
      this.isLoadingResults = false;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
        let wsname: string;
        let ws: XLSX.WorkSheet;
        let parsedData: any;
        const sheets = [];
        /*this.utilities.log('wb.Sheets', wb.Sheets);
        this.utilities.log('wb.SheetNames', wb.SheetNames);*/
  
        /* grab first sheet */
        wb.SheetNames.forEach((key, index) => {
          wsname = key;
          ws = wb.Sheets[key];
          parsedData = XLSX.utils.sheet_to_json(ws, {blankrows: false});
          const sheet = {} as any;
          sheet.name = wsname;
          sheet.rowData = parsedData;
          sheet.columnDefs = Object.keys(parsedData[0]).map(column => {
            return {field: column};
          });
          sheets.push(sheet);
        });
  
        this.utilities.log('sheets', sheets);
  
        // guardando los datos en el provider
        this.sharedDataService.data = {
          sheets: sheets
        };
        this.utilities.log('sharedDataService data seted', this.sharedDataService.data);
        // this.utilities.log('parsed xlsx data', this.parsedData);
        this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
        this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
        this.close();
      };
      reader.readAsBinaryString(result);
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error on url request');
      this.utilities.showSnackBar('Error on url request', 'OK');
    }));
  }

  loadApi() {
    this.subscriptions.push(this.httpClient.get(this.urlInput.value, { responseType: 'blob'})
      .subscribe(response => {
        this.utilities.log('resultado obtenido', response);
        this.utilities.log('tipo', typeof response);
        this.isLoadingResults = false;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
          let wsname: string;
          let ws: XLSX.WorkSheet;
          let parsedData: any;
          const sheets = [];
          /*this.utilities.log('wb.Sheets', wb.Sheets);
          this.utilities.log('wb.SheetNames', wb.SheetNames);*/
          /* grab first sheet */
          wb.SheetNames.forEach((key, index) => {
            wsname = key;
            ws = wb.Sheets[key];
            parsedData = XLSX.utils.sheet_to_json(ws, {blankrows: false});
            const sheet = {} as any;
            sheet.name = wsname;
            sheet.rowData = parsedData;
            sheet.columnDefs = Object.keys(parsedData[0]).map(column => {
              return {field: column};
            });
            sheets.push(sheet);
          });
          this.utilities.log('sheets', sheets);
          // guardando los datos en el provider
          this.sharedDataService.data = {
            sheets: sheets
          };
          this.utilities.log('sharedDataService data seted', this.sharedDataService.data);
          // this.utilities.log('parsed xlsx data', this.parsedData);
          this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
          this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
          this.close();
        };
        reader.readAsBinaryString(response);
      }, error => {
        this.isLoadingResults = false;
        this.utilities.error('Error on api request');
        this.utilities.showSnackBar(`Error on api request`, 'OK');
      }));
  }

  onSubmit() {
    this.utilities.log('submiting');
    if (this.importType === 'url') {
      this.loadUrl();
    }
    if (this.importType === 'api') {
      this.loadApi();
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
