import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { debounceTime, takeLast } from 'rxjs/operators';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';

@Component({
  selector: 'app-admin-templates-dialog',
  templateUrl: './admin-templates-dialog.component.html',
  styleUrls: ['./admin-templates-dialog.component.css']
})
export class AdminTemplatesDialogComponent implements OnInit {
  title: string;
  message: string;
  filterInput: FormControl;
  country: FormControl;
  city: FormControl;
  department: FormControl;
  cities: Observable<any[]>;
  departments: Observable<any[]>;
  countries: Observable<any[]>;
  collection: any[];
  filteredCollection: any[];
  isLoadingResults = true;
  constructor(public dialogRef: MatDialogRef<AdminTemplatesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
              private dataProvider: DataProviderService) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.message) {
      this.message = data.message;
    }
    this.country = new FormControl('');
    this.city = new FormControl('');
    this.department = new FormControl('');
    this.countries = this.dataProvider.getAllCountries();
    this.country.valueChanges.subscribe(country => {
      this.filteredCollection = [];
      this.departments = this.dataProvider.getAllDepartments(country.id);
    });
    this.department.valueChanges.subscribe(department => {
      this.filteredCollection = [];
      this.cities = this.dataProvider.getAllCities(department.id);
    });
    this.city.valueChanges.subscribe(cityId => {
      this.dataProvider
      .getAllPlants(cityId)
      .subscribe((results: any) => {
        this.isLoadingResults = false;
        this.utilities.log('plants results', results);
        if (results.content) {
          this.collection = results.content.filter(plant => plant.cityId === cityId);
        } else {
          this.collection = results.filter(plant => plant.cityId === cityId);
        }
        this.filteredCollection = this.collection.slice();
        this.utilities.log('filtered collection', this.filteredCollection);
      }, error => {
        this.isLoadingResults = false;
        this.utilities.error('Error loading owners', error);
        this.utilities.showSnackBar('Error fetching owners', 'OK');
      });
    });
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
