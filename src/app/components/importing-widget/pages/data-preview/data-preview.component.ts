import { OnDestroy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../../services/shared-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModelMap, IMPORTING_TYPES } from '../../../../models/model-maps.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css']
})
export class DataPreviewComponent implements OnInit, OnDestroy {
  sheets: any[] = []; // hojas del libro excel
  rowData: any[] = [];
  columnDefs: any[] = [];
  title = '';
  subscriptions: Subscription[] = [];
  constructor(private sharedDataService: SharedDataService, private router: Router,
              private utilities: UtilitiesService) {
    this.sheets = this.sharedDataService.getSheets();
    this.subscriptions.push(this.sharedDataService.rowData.subscribe(rowData => {
      this.utilities.log('new rowData arrived', rowData);
      if (rowData) {
        this.rowData = rowData;
      }
    }, error => {
      this.utilities.error('Error obtaining row data', error);
      this.utilities.showSnackBar('Error obtaining row data', 'OK');
    }));
    this.subscriptions.push(this.sharedDataService.columnDefs.subscribe(columnDefs => {
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
    }));
    this.utilities.log('in data-preview initial sheets', this.sheets);
    if (this.sheets.length > 0) {
      this.setData();
    }
    this.subscriptions.push(this.sharedDataService.sheets.subscribe(sheets => {
      this.utilities.log('sharedDataService data received', sheets);
      if (sheets) {
        this.sheets = sheets;
        this.setData();
      }
      this.utilities.log('final sheets', this.sheets);
    }, error => {
      this.utilities.error('Error obtaining file sheets');
      this.utilities.showSnackBar('Error obtaining file sheets', 'OK');
    }));
    const dataTypeToImport = this.sharedDataService.getDataType();
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
    this.sharedDataService.data = this.rowData;
  }

  goBack() {
    this.rowData = [];
    this.columnDefs = [];
    this.sheets = [];
    this.sharedDataService.setFileName('');
    this.sharedDataService.setRowData([]);
    this.sharedDataService.setSheets([]);
    this.sharedDataService.setColumnDefs([]);
    this.router.navigate([{outlets: {importing: 'importing/file-import'}}]);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
