import { Inject, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { debounceTime } from 'rxjs/operators';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';

@Component({
  selector: 'app-owner-selector-dialog',
  templateUrl: './owner-selector-dialog.component.html',
  styleUrls: ['./owner-selector-dialog.component.css']
})
export class OwnerSelectorDialogComponent implements OnInit {
  title: string;
  message: string;
  filterInput: FormControl;
  collection: any[];
  filteredCollection: any[];
  isLoadingResults = true;
  constructor(public dialogRef: MatDialogRef<OwnerSelectorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
              private dataProvider: DataProviderService) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.message) {
      this.message = data.message;
    }
    if (data.collection) {
        data.collection.subscribe(results => {
        this.isLoadingResults = false;
        this.utilities.log('owner results', results);
        if (results.content) {
          this.collection = results.content;
        } else {
          this.collection = results;
        }
        this.filteredCollection = this.collection.slice();
        this.utilities.log('filtered collection', this.filteredCollection);
      }, error => {
        this.isLoadingResults = false;
        this.utilities.error('Error loading owners', error);
        this.utilities.showSnackBar('Error fetching owners', 'OK');
      });
    }
    this.filterInput = new FormControl('');
    this.filterInput.valueChanges.pipe(debounceTime(400)).subscribe(inputText => {
      inputText = inputText.toLowerCase();
      this.filteredCollection = this.collection.filter(element =>
        element.name.toLowerCase().includes(inputText));
    });
  }
  setSelectedElement(element: any) {
    this.dialogRef.close(element);
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(null);
  }

}
