import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { ModelMap } from '../../models/model-maps.model';

import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { takeLast, take, debounceTime, distinctUntilChanged, retry, tap } from 'rxjs/operators';
import { Observable, Subject, merge, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-lpn-relocate',
  templateUrl: './lpn-relocate.component.html',
  styleUrls: ['./lpn-relocate.component.css']
})
export class LpnRelocateComponent implements OnInit, AfterViewInit {
  definitions: any = ModelMap.LpnMap;
  lpnCodeSearch: FormControl;
  locationTypeSearch: FormControl;
  locationCodeSearch: FormControl;
  isLoadingResults = false;
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

  loadDataPage() {
    
  }

  searchLpn() {
  }

  searchLocation() {
  }

  relocate(lpn: any) {

  }

  relocatePrompt(lpn?: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.relocate(lpn);
        }
      },
      error: (error) => {

      }
    } as Observer<boolean>;
    this.utilities.showCommonDialog(observer, {
      title: 'Delete Row',
      message: 'You are about to delete this record(s). Are you sure to continue?'
    });
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }
}
