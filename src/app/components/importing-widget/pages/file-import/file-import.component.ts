import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataStorage } from '../../../../services/data-provider';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../../../import-dialog/import-dialog.component';
import { ModelMap } from '../../../../models/model-maps.model';
import * as XLSX from 'xlsx';
import { of, from } from 'rxjs';

/*import { Grid } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
*/
@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.css']
})
export class FileImportComponent implements OnInit {
  isLoadingResults = false;
  isDataSaved = false;
  file: File;
  displayedColumns: string[];
  parsedData: any;
  constructor(private dialog: MatDialog, private utilities: UtilitiesService, private router: Router,
              private dataProvider: DataStorage) { 
    // this.displayedColumns = Object.keys(ModelMap.LocationMap);
  }

  ngOnInit(): void {
  }

  validateFile(files: FileList) {
    this.file = files[0];
    console.log('file', this.file);
    console.log('file size', this.file.size);
    console.log('file type', this.file.type);
    if (this.file.size > (5 * 1024 * 1024)) {
      this.utilities.showSnackBar('The file size is bigger than 5MB', 'OK');
      return;
    }
    if (this.file.type !== 'text/csv' && this.file.type !== 'application/vnd.ms-excel'
      && this.file.type !== 'application/csv' && this.file.type !== 'application/x-csv'
      && this.file.type !== 'text/x-csv' && this.file.type !== 'text/plain'
      && this.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.utilities.showSnackBar('The file format is invalid', 'OK');
      return;
    }
    this.loadFile();
  }

  loadFile() {
    console.log('file attached', this.file);
    this.isLoadingResults = true;
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
      this.dataProvider.setSheets(sheets);
      this.dataProvider.setFileName(this.file.name);
      /*this.dataProvider.data = {
        sheets: sheets
      };*/
      console.log('dataProvider data seted', sheets);

      // console.log('parsed xlsx data', this.parsedData);
      this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
      this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
    };
    reader.readAsBinaryString(this.file);
    /*if (this.file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        || this.file.type.includes('application/vnd.ms-excel')) {
      this.isLoadingResults = true;
      readXlsxFile(this.file).then((rows) => {
        this.isLoadingResults = false;
        // `rows` is an array of rows
        // each row being an array of cells.
        const fields = Object.assign(rows[0]);
        rows.splice(0, 1);
        this.parsedData = rows.map((row, index) => {
          // return {...row};
          const object = {};
          fields.map((field, _index) => {
            object[field] = row[_index];
          });
          return object;
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify({
              rows: this.parsedData,
              columns: fields
            })
          }
        };
        console.log('parsed xlsx data', this.parsedData);
        this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}], navigationExtras);
        this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
      });
    }*/
  }

  importUrl(_type: string) {
    this.isDataSaved = false;
    this.isLoadingResults = true;
    const dialogRef = this.dialog.open(ImportDialogComponent,
      { data: {
          type: _type
        },
        width: '450px'
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults = false;
      console.log('dialog result:', result);
      if (result && result.length > 0) {

        const receivedKeys: any[] = Object.keys(result[0]);

        if (!this.utilities.equalArrays(receivedKeys, this.displayedColumns)) {
          console.error('el formato de los datos recibidos no coincide con el formato esperado');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
      }
    });
  }
}
