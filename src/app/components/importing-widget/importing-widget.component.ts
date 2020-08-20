import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from '../../services/utilities.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-importing-widget',
  templateUrl: './importing-widget.component.html',
  styleUrls: ['./importing-widget.component.css']
})
export class ImportingWidgetComponent implements OnInit, OnDestroy {
  fileName: string;
  sheets: any[];
  mobileQuery: MediaQueryList;
  subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ImportingWidgetComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
    private httpClient: HttpClient, private sharedDataService: SharedDataService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
      this.init();
      // responsive del panel lateral izquierdo
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.subscriptions.push(this.sharedDataService.sheets.subscribe(sheets => {
        this.utilities.log('Sheets on importing-widget', sheets);
        if (sheets) {
          this.sheets = sheets;
        }
      }, error => {
        this.utilities.error('Error obtaining file sheets');
        this.utilities.showSnackBar('Error obtaining file sheets', 'OK');
      }));
      this.subscriptions.push(this.sharedDataService.fileName.subscribe(fileName => {
        this.utilities.log('fileName on importing-widget', fileName);
        this.fileName = fileName;
      }, error => {
        this.utilities.error('Error obtaining file name');
        this.utilities.showSnackBar('Error obtaining file name', 'OK');
      }));
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
      El valor de sharedDataService.data es asignado desde el componente data-preview.
      El envio de datos a traves del metodo close puede suprimirse y usar el provider en el componente
      llamante una vez que se cierre este dialogo.
    */
    this.utilities.log('sharedDataService.data a retornar', this.sharedDataService.data);
    this.dialogRef.close(this.sharedDataService.data);
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
    this.utilities.log('change sheet requested');
    this.sharedDataService.data = sheet.rowData;
    this.sharedDataService.setRowData(sheet.rowData);
    this.sharedDataService.setColumnDefs(sheet.columnDefs);
  }

  private _mobileQueryListener: () => void;

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
