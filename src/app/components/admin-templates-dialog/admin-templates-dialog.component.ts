import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
  filterInput: FormControl;
  types: Observable<any[]>;
  templates: any[];
  selectedTemplate: any;
  filteredCollection: any[];
  isLoadingList = true;
  form: FormGroup;
  viewMode = 'view';
  preview: any;
  constructor(public dialogRef: MatDialogRef<AdminTemplatesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
              private dataProvider: DataProviderService) {
    this.form = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      enableDate: new FormControl(''),
      labelTypeId: new FormControl('')
    });
    this.types = this.dataProvider.getAllTemplateTypes();
    this.dataProvider.getAllTemplates().subscribe(results => {
      this.templates = results;
    });
    this.filterInput = new FormControl('');
    this.filterInput.valueChanges.pipe(debounceTime(400)).subscribe(inputText => {
      inputText = inputText.toLowerCase();
      this.filteredCollection = this.templates.filter(element =>
        element.name.toLowerCase().includes(inputText));
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('Formulario invalido');
      this.utilities.showSnackBar('Invalid form. Please check required fields and try again', 'OK');
    }
  }

  edit() {
    this.viewMode = 'edit';
  }

  save() {
    this.viewMode = 'edit';
  }

  cancel() {
    this.viewMode = 'view';
  }

  setSelectedTemplate(template: any) {
    this.selectedTemplate = template;
    this.preview = template.jsonTemplate;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(null);
  }

}
