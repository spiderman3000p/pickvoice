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
  selector: 'app-import-type-selection',
  templateUrl: './import-type-selection.component.html',
  styleUrls: ['./import-type-selection.component.css']
})
export class ImportTypeSelectionComponent implements OnInit {
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

  import(dataType: string) {
    this.dataProvider.setDataType(dataType);
    this.router.navigate ([{ outlets: { importing: 'importing/file-import'}}]);
  }
}
