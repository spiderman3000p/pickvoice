import { Inject, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from '../../services/utilities.service';
import { DataStorage } from '../../services/data-provider';

@Component({
  selector: 'app-importing-widget',
  templateUrl: './importing-widget.component.html',
  styleUrls: ['./importing-widget.component.css']
})
export class ImportingWidgetComponent implements OnInit {
  fileName: string;
  sheets: any[];
  constructor(
    public dialogRef: MatDialogRef<ImportingWidgetComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
    private httpClient: HttpClient, private dataProvider: DataStorage) {
      this.init();
      this.dataProvider.sheets.subscribe(sheets => {
        console.log('sheets on importing-widget', sheets);
        if (sheets) {
          this.sheets = sheets;
        }
      });
      this.dataProvider.fileName.subscribe(fileName => {
        console.log('fileName on importing-widget', fileName);
        this.fileName = fileName;
      });
      this.router.navigate([{outlets: {importing: 'importing'}}]);
  }

  init() {
    this.fileName = '';
    this.sheets = [];
  }

  loadData() {
    // validamos los datos
    // this.validateData();
    // cerramos el dialogo enviando los datos en formato json al componente llamante.
    this.init();
    this.dialogRef.close(this.dataProvider.data);
  }

  validateData() {
    
  }

  close() {
    this.init();
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  goBack() {
    this.fileName = '';
    this.sheets = [];
    this.router.navigate([{outlets: {importing: 'importing'}}]);
  }

  changeSheet(sheet: any) {
    console.log('change sheet requested');
    this.dataProvider.data = sheet.rowData;
    this.dataProvider.setRowData(sheet.rowData);
    this.dataProvider.setColumnDefs(sheet.columnDefs);
  }

}
