import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataStorage } from '../../../../services/data-provider';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../../../import-dialog/import-dialog.component';
import * as XLSX from 'xlsx';
import { of, from } from 'rxjs';
import { ModelMap, IMPORTING_TYPES } from '../../../../models/model-maps.model';
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
  title: string = '';
  constructor(private dialog: MatDialog, private utilities: UtilitiesService, private router: Router,
              private dataProvider: DataStorage) {
    // TODO: obtener de la ruta el tipo de datos a importar: items, locations u orders_dto
    this.dataTypeToImport = this.dataProvider.getDataType();
    this.utilities.log('data type to import', this.dataTypeToImport);
    // Obtener las columnas a mostrar segun el tipo de datos recibidos
    this.displayedColumns = Object.keys(this.utilities.dataTypesModelMaps[this.dataTypeToImport]);
    // eliminar campos por defecto y demas settings segun el tipo de datos seleccionado
    if (this.dataTypeToImport === IMPORTING_TYPES.ITEMS) {
      this.title = 'Importing Items';
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'itemState');
    }
    if (this.dataTypeToImport === IMPORTING_TYPES.LOCATIONS) {
      this.title = 'Importing Locations';
    }
    if (this.dataTypeToImport === IMPORTING_TYPES.ORDERS_DTO) {
      this.title = 'Importing Orders';
    }
    if (this.dataTypeToImport === IMPORTING_TYPES.LOADPICKS_DTO) {
      this.title = 'Importing Load Picks';
    }
    this.utilities.log('displayedColumns', this.displayedColumns);
  }

  ngOnInit(): void {
  }

  validateFile(files: FileList) {
    this.file = files[0];
    this.utilities.log('file', this.file);
    this.utilities.log('file size', this.file.size);
    this.utilities.log('file type', this.file.type);
    // this.utilities.log('file path', this.file.webkitRelativePath);
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
    this.utilities.log('file attached', this.file);
    this.isLoadingResults = true;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy'});
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
        parsedData = XLSX.utils.sheet_to_json(ws, {blankrows: false, defval: '', raw: false, dateNF: 'dd/mm/yyyy'});
        this.utilities.log('initial parsed data', parsedData);
        if (parsedData.length === 0) {
          this.utilities.error('empty parsed data', parsedData);
          return;
        }
        const sheet = {} as any;
        sheet.name = wsname;
        sheet.rowData = parsedData;
        this.utilities.log('keys parsed', Object.keys(parsedData[0]));
        sheet.columnDefs = Object.keys(parsedData[0]).map(column => {
          return {
            field: column,
            filter: true,
            editable: true,
            sortable: true
          };
        });
        sheets.push(sheet);
      });

      this.utilities.log('sheets', sheets);

      // guardando los datos en el provider
      this.dataProvider.setSheets(sheets);
      this.dataProvider.setFileName(this.file.name);
      this.dataProvider.filePath = 'unknown'; /*this.file.webkitRelativePath;*/
      this.utilities.log('dataProvider data seted', sheets);

      // this.utilities.log('parsed xlsx data', this.parsedData);
      this.router.navigate ([{ outlets: { importing: 'importing/data-preview'}}]);
      // this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
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
      this.utilities.log('dialog result:', result);
      if (result && result.length > 0) {

        const receivedKeys: any[] = Object.keys(result[0]);

        if (!this.utilities.equalArrays(receivedKeys, this.displayedColumns)) {
          this.utilities.error('the received data schema is not valid');
          this.utilities.showSnackBar('Error in data format', 'OK');
          return;
        }
      }
    }, error => {
      this.utilities.error('Error after importing dialog close event');
      this.utilities.showSnackBar('Error after importing dialog close event', 'OK');
    });
  }

  goBack() {
    this.isLoadingResults = false;
    this.isDataSaved = false;
    this.router.navigate([{outlets: {importing: 'importing/import-type-selection'}}]);
  }
}
