import { ViewChild, Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelMap, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-open-template-dialog',
  templateUrl: './open-template-dialog.component.html',
  styleUrls: ['./open-template-dialog.component.css']
})
export class OpenTemplateDialogComponent implements OnInit, AfterViewInit {
  title: string;
  message: string;
  selectedTemplate: any;
  templates: Observable<any[]>;
  isLoading = true;
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<OpenTemplateDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      template: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
    
  }

  loadData() {
    this.templates = this.dataProviderService.getAllTemplates()
    .pipe(finalize(() => this.isLoading = false));
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('formulario:', this.form.value);
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.dialogRef.close(this.form.value.template);
  }
}
