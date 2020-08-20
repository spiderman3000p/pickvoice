import { Inject, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, Observer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  selectedTemplate: any = {};
  filteredCollection: any[];
  isLoadingList = true;
  form: FormGroup;
  viewMode = 'view';
  preview: any;
  constructor(public dialogRef: MatDialogRef<AdminTemplatesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService,
              private dataProvider: DataProviderService) {
    this.form = new FormGroup({
      code: new FormControl(this.selectedTemplate.code, [Validators.required]),
      name: new FormControl(this.selectedTemplate.name, [Validators.required]),
      description: new FormControl(this.selectedTemplate.description, [Validators.required]),
      enableDate: new FormControl(this.selectedTemplate.enableDate, [Validators.required]),
      labelTypeId: new FormControl(this.selectedTemplate.labelTypeId, [Validators.required])
    });
    this.types = this.dataProvider.getAllTemplateTypes();
    this.dataProvider.getAllTemplates().subscribe(results => {
      this.isLoadingList = false;
      this.templates = results;
      this.utilities.log('templates', this.templates);
    }, err => {
      this.utilities.error('error fetching template', err);
      this.utilities.showSnackBar('Error fetching templates', 'OK');
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
    this.isLoadingList = true;
    this.dataProvider.updateTemplate(this.selectedTemplate.id, this.selectedTemplate).subscribe(result => {
      this.isLoadingList = false;
      this.utilities.log('template updated successfully');
      this.utilities.showSnackBar('Template updated succcesfully', 'OK');
    }, err => {
      this.isLoadingList = false;
      this.utilities.log('error updating template', err);
      this.utilities.showSnackBar('Unknown error updating template', 'OK');
    });
  }

  cancel() {
    this.viewMode = 'view';
    this.form = new FormGroup({
      code: new FormControl(this.selectedTemplate.code, [Validators.required]),
      name: new FormControl(this.selectedTemplate.name, [Validators.required]),
      description: new FormControl(this.selectedTemplate.description, [Validators.required]),
      enableDate: new FormControl(this.selectedTemplate.enableDate, [Validators.required]),
      labelTypeId: new FormControl(this.selectedTemplate.labelTypeId, [Validators.required])
    });
  }

  setSelectedTemplate(template: any) {
    this.selectedTemplate = template;
    const jsonTemplate = JSON.parse(template.jsonTemplate);
    this.utilities.log('jsonTemplate', jsonTemplate);
    this.preview = `<html><head><style>${jsonTemplate['gjs-css']}</style></head>
    <body><div>${jsonTemplate['gjs-html']}</div></body></html>`;
    const selectedTemplateCopy = Object.assign({}, this.selectedTemplate);
    this.setFormValues(selectedTemplateCopy);
  }

  setFormValues(template: any) {
    this.form = new FormGroup({
      code: new FormControl(template.code, [Validators.required]),
      name: new FormControl(template.name, [Validators.required]),
      description: new FormControl(template.description, [Validators.required]),
      enableDate: new FormControl(template.enableDate, [Validators.required]),
      labelTypeId: new FormControl(template.labelTypeId, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(null);
  }

  delete(template: any) {
    this.isLoadingList = true;
    this.dataProvider.deleteTemplate(template.id).subscribe(result => {
      this.isLoadingList = false;
      if ( result) {
        if (this.selectedTemplate.id === template.id) {
          this.selectedTemplate = {};
          this.preview = '';
          const index = this.templates.findIndex(_template => _template.id === template.id);
          this.templates.splice(index, 1);
        }
        this.utilities.log('template deleted successfully');
        this.utilities.showSnackBar('Template deleted succcesfully', 'OK');
      }
    }, err => {
      this.isLoadingList = false;
      this.utilities.log('error deleting  template', err);
      this.utilities.showSnackBar('Unknown error deleting template', 'OK');
    });
  }

  deleteTemplatePrompt(template: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.delete(template);
        }
      }
    } as Observer<boolean>;
    this.utilities.showCommonDialog(observer, {
      title: 'Delete Template',
      message: 'You are about to delete this template. Are you sure to continue?'
    });
  }
}
