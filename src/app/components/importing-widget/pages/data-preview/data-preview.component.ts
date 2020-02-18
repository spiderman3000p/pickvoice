import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from '../../../../services/data-provider';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css']
})
export class DataPreviewComponent implements OnInit {
  sheets: any[] = []; // hojas del libro excel
  rowData: any[] = [];
  columnDefs: any[] = [];

  constructor(private dataProvider: DataStorage, private router: Router) {
    this.sheets = this.dataProvider.getSheets();
    this.dataProvider.rowData.subscribe(rowData => {
      console.log('new rowData arrived', rowData);
      if (rowData) {
        this.rowData = rowData;
      }
    });
    this.dataProvider.columnDefs.subscribe(columnDefs => {
      console.log('new columnDefs arrived', columnDefs);
      if (columnDefs) {
        this.columnDefs = columnDefs.map(col => {
          col['filter'] = true;
          col['editable'] = true;
          col['sortable'] = true;
          return col;
        });
        // this.columnDefs = columnDefs;
      }
    });
    console.log('in data-preview initial sheets', this.sheets);
    if (this.sheets.length > 0) {
      this.setData();
    }
    this.dataProvider.sheets.subscribe(sheets => {
      console.log('dataProvider data received', sheets);
      if (sheets) {
        this.sheets = sheets;
        this.setData();
      }
      console.log('final sheets', this.sheets);
    });
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
