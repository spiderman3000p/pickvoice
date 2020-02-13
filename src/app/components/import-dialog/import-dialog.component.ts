import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { DataStorage } from '../../services/data-provider';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent {
  importType: string;
  fileInput: FormControl;
  urlInput: FormControl;
  // apiType: FormControl;
  file: File;
  parsedData: any;
  isLoadingResults = false;
  dialogTitle = '';

  constructor(public dialogRef: MatDialogRef<ImportDialogComponent>, private dataProvider: DataStorage,
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
    console.log('file', this.file);
    console.log('file size', this.file.size);
    console.log('file type', this.file.type);
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

  loadFile() {
    console.log('file attached', this.file);
    if (this.file.type.includes('text') || this.file.type.includes('csv') ||
        this.file.type.includes('application/vnd.ms-excel')) {
      this.isLoadingResults = true;
     
    } else if (this.file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        || this.file.type.includes('application/vnd.ms-excel')) {
      this.isLoadingResults = true;
    }
  }

  loadUrl() {

    if (this.urlInput.value.endsWith('.csv') || this.urlInput.value.endsWith('.txt') ||
    this.urlInput.value.endsWith('.xls') || this.urlInput.value.endsWith('.xlsx')) {
      this.isLoadingResults = true;
      this.httpClient.get(this.urlInput.value, { responseType: 'blob'}).pipe(
        tap(
          data => {
            console.log('data', data);
          },
          error => {
            console.error('error', error);
          }
        )
      ).subscribe(result => {
        console.log('resultado obtenido', result);
        console.log('tipo', typeof result);
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
          /*console.log('wb.Sheets', wb.Sheets);
          console.log('wb.SheetNames', wb.SheetNames);*/
    
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
    
          console.log('sheets', sheets);
    
          // guardando los datos en el provider
          this.dataProvider.data = {
            sheets: sheets
          };
          console.log('dataProvider data seted', this.dataProvider.data);
          // console.log('parsed xlsx data', this.parsedData);
          this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
          this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
          this.close();
        };
        reader.readAsBinaryString(result);
      });
    } else {
      this.utilities.showSnackBar(`File extension is invalid`, 'OK');
    }
  }

  loadApi() {
    if (/*this.apiType.value === 'xlsx' || this.apiType.value === 'csv'*/ true) {
      this.httpClient.get(this.urlInput.value, { responseType: 'blob'}).pipe(
        tap(
          data => {
            console.log('data', data);
          },
          error => {
            console.error('error', error);
          }
        )
      ).subscribe(response => {
        console.log('resultado obtenido', response);
        console.log('tipo', typeof response);
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
          /*console.log('wb.Sheets', wb.Sheets);
          console.log('wb.SheetNames', wb.SheetNames);*/
    
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
    
          console.log('sheets', sheets);
    
          // guardando los datos en el provider
          this.dataProvider.data = {
            sheets: sheets
          };
          console.log('dataProvider data seted', this.dataProvider.data);
          // console.log('parsed xlsx data', this.parsedData);
          this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
          this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
          this.close();
        };
        reader.readAsBinaryString(response);
      });
    } else {
      this.utilities.showSnackBar(`File extension is invalid`, 'OK');
    }
  }

  onSubmit() {
    console.log('submiting');
    if (this.importType === 'csv') {
      this.loadFile();
    }
    if (this.importType === 'url') {
      this.loadUrl();
    }
    if (this.importType === 'api') {
      this.loadApi();
    }
  }

  close() {
    this.dialogRef.close(this.parsedData);
  }
}
