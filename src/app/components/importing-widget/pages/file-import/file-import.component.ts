import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataStorage } from '../../../../services/data-provider';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../../../import-dialog/import-dialog.component';
import * as XLSX from 'xlsx';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.css']
})
export class FileImportComponent implements OnInit {
  isLoadingResults = false;
  isDataSaved = false;
  dataTypeToImport = '';
  file: File;
  displayedColumns: string[];
  parsedData: any;

  constructor(private dialog: MatDialog, private utilities: UtilitiesService, private router: Router,
              private dataProvider: DataStorage) {
    // TODO: obtener de la ruta el tipo de datos a importar: items, locations u orders
    this.dataTypeToImport = this.dataProvider.getDataType();
    console.log('data type to import', this.dataTypeToImport);
    // Obtener las columnas a mostrar segun el tipo de datos recibidos
    this.displayedColumns = Object.keys(this.utilities.dataTypesModelMaps[this.dataTypeToImport]);
    console.log('displayedColumns', this.displayedColumns);
  }

  ngOnInit(): void {
  }

  validateFile(files: FileList) {
    this.file = files[0];
    console.log('file', this.file);
    console.log('file size', this.file.size);
    console.log('file type', this.file.type);
    console.log('file path', this.file.webkitRelativePath);
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
        parsedData = XLSX.utils.sheet_to_json(ws, {blankrows: false, defval: ''});
        const sheet = {} as any;
        sheet.name = wsname;
        sheet.rowData = parsedData;
        console.log('keys parsed', Object.keys(parsedData[0]));
        sheet.columnDefs = Object.keys(parsedData[0]).map(column => {
          return {field: column};
        });
        sheets.push(sheet);
      });

      console.log('sheets', sheets);

      // guardando los datos en el provider
      this.dataProvider.setSheets(sheets);
      this.dataProvider.setFileName(this.file.name);
      this.dataProvider.filePath = this.file.webkitRelativePath;
      /*this.dataProvider.data = {
        sheets: sheets
      };*/
      console.log('dataProvider data seted', sheets);

      // console.log('parsed xlsx data', this.parsedData);
      this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
      this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
    };
    reader.readAsBinaryString(this.file);
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
          console.error('the received data schema is not valid');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
      }
    });
  }

  goBack() {
    this.isLoadingResults = false;
    this.isDataSaved = false;
    this.router.navigate([{outlets: {importing: 'importing/import-type-selection'}}]);
  }
}
