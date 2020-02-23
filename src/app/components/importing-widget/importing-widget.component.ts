import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
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
export class ImportingWidgetComponent implements OnInit, OnDestroy {
  fileName: string;
  sheets: any[];
  mobileQuery: MediaQueryList;
  constructor(
    public dialogRef: MatDialogRef<ImportingWidgetComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
    private httpClient: HttpClient, private dataProvider: DataStorage,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
      this.init();
      // responsive del panel lateral izquierdo
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.dataProvider.sheets.subscribe(sheets => {
        console.log('Sheets on importing-widget', sheets);
        if (sheets) {
          this.sheets = sheets;
        }
      }, error => {
        console.error('Error obtaining file sheets');
        this.utilities.showSnackBar('Error obtaining file sheets', 'OK');
      });
      this.dataProvider.fileName.subscribe(fileName => {
        console.log('fileName on importing-widget', fileName);
        this.fileName = fileName;
      }, error => {
        console.error('Error obtaining file name');
        this.utilities.showSnackBar('Error obtaining file name', 'OK');
      });
      this.router.navigate([{outlets: {importing: 'importing'}}]);
  }

  init() {
    this.fileName = '';
    this.sheets = [];
  }

  loadData() {
    // cerramos el dialogo enviando los datos en formato json al componente llamante.
    this.init();
    /*
      El valor de dataProvider.data es asignado desde el componente data-preview.
      El envio de datos a traves del metodo close puede suprimirse y usar el provider en el componente
      llamante una vez que se cierre este dialogo.
    */
    console.log('dataProvider.data a retornar', this.dataProvider.data);
    this.dialogRef.close(this.dataProvider.data);
  }

  close() {
    this.init();
    this.dialogRef.close();
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

  private _mobileQueryListener: () => void;

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
