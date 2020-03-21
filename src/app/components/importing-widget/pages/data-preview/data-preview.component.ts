import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from '../../../../services/data-provider';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModelMap, IMPORTING_TYPES } from '../../../../models/model-maps.model';
@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css']
})
export class DataPreviewComponent implements OnInit {
  sheets: any[] = []; // hojas del libro excel
  rowData: any[] = [];
  columnDefs: any[] = [];
  title: string = '';
  constructor(private dataProvider: DataStorage, private router: Router,
              private utilities: UtilitiesService) {
    this.sheets = this.dataProvider.getSheets();
    this.dataProvider.rowData.subscribe(rowData => {
      this.utilities.log('new rowData arrived', rowData);
      if (rowData) {
        this.rowData = rowData;
      }
    }, error => {
      this.utilities.error('Error obtaining row data', error);
      this.utilities.showSnackBar('Error obtaining row data', 'OK');
    });
    this.dataProvider.columnDefs.subscribe(columnDefs => {
      this.utilities.log('new columnDefs arrived', columnDefs);
      if (columnDefs) {
        this.columnDefs = columnDefs.map(col => {
          col.filter = true;
          col.editable = true;
          col.sortable = true;
          return col;
        });
        this.utilities.log('columnDefs sortable', this.columnDefs);
      }
    }, error => {
      this.utilities.error('Error obtaining file columns definitions');
      this.utilities.showSnackBar('Error obtaining columns definitions', 'OK');
    });
    this.utilities.log('in data-preview initial sheets', this.sheets);
    if (this.sheets.length > 0) {
      this.setData();
    }
    this.dataProvider.sheets.subscribe(sheets => {
      this.utilities.log('dataProvider data received', sheets);
      if (sheets) {
        this.sheets = sheets;
        this.setData();
      }
      this.utilities.log('final sheets', this.sheets);
    }, error => {
      this.utilities.error('Error obtaining file sheets');
      this.utilities.showSnackBar('Error obtaining file sheets', 'OK');
    });
    const dataTypeToImport = this.dataProvider.getDataType();
    if (dataTypeToImport === IMPORTING_TYPES.ITEMS) {
      this.title = 'Importing Items';
    }
    if (dataTypeToImport === IMPORTING_TYPES.LOCATIONS) {
      this.title = 'Importing Locations';
    }
    if (dataTypeToImport === IMPORTING_TYPES.ORDERS_DTO) {
      this.title = 'Importing Orders';
    }
    if (dataTypeToImport === IMPORTING_TYPES.LOADPICKS_DTO) {
      this.title = 'Importing Load Picks';
    }
  }

  setData() {
    if (this.sheets.length > 0) {
      this.rowData = this.sheets[0].rowData;
      this.columnDefs = this.sheets[0].columnDefs.map(col => {
        col.filter = true;
        col.editable = true;
        col.sortable = true;
        return col;
      });
      this.utilities.log('columnDefs sortable', this.columnDefs);
    }
    this.dataProvider.data = this.rowData;
  }

  goBack() {
    this.rowData = [];
    this.columnDefs = [];
    this.sheets = [];
    this.dataProvider.setFileName('');
    this.dataProvider.setRowData([]);
    this.dataProvider.setSheets([]);
    this.dataProvider.setColumnDefs([]);
    this.router.navigate([{outlets: {importing: 'importing/file-import'}}]);
  }

  ngOnInit(): void {
  }

}
