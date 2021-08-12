import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../services/utilities.service';
import { SharedDataService } from '../../../../services/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { IMPORTING_TYPES } from '../../../../models/model-maps.model';

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
  types = IMPORTING_TYPES;
  constructor(private dialog: MatDialog, private utilities: UtilitiesService, private router: Router,
              private sharedDataService: SharedDataService) {
  }

  ngOnInit(): void {
  }

  import(dataType: string) {
    this.sharedDataService.setDataType(dataType);
    this.router.navigate ([{ outlets: { importing: 'importing/file-import'}}]);
  }
}
