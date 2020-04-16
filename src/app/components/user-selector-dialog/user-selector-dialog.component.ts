import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, takeLast } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-user-selector-dialog',
  templateUrl: './user-selector-dialog.component.html',
  styleUrls: ['./user-selector-dialog.component.css']
})
export class UserSelectorDialogComponent implements OnInit {
  title: string;
  message: string;
  filterInput: FormControl;
  collection: any[];
  filteredCollection: any[];
  isLoadingResults = true;
  constructor(public dialogRef: MatDialogRef<UserSelectorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.message) {
      this.message = data.message;
    }
    if (data.collection) {
      data.collection.subscribe(results => {
        this.isLoadingResults = false;
        this.utilities.log('user results', results);
        this.collection = results;
        this.filteredCollection = this.collection.slice();
        this.utilities.log('filtered collection', this.filteredCollection);
      }, error => {
        this.isLoadingResults = false;
        this.utilities.error('Error loading users', error);
        this.utilities.showSnackBar('Error fetching users', 'OK');
      });
    }
    this.filterInput = new FormControl('');
    this.filterInput.valueChanges.pipe(debounceTime(400)).subscribe(inputText => {
      inputText = inputText.toLowerCase();
      this.filteredCollection = this.collection.filter(element =>
        element.firstName.toLowerCase().includes(inputText) ||
        element.lastName.toLowerCase().includes(inputText) ||
        element.userName.toLowerCase().includes(inputText));
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
