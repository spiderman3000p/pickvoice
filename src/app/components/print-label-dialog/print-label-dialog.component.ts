import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-print-label-dialog',
  templateUrl: './print-label-dialog.component.html',
  styleUrls: ['./print-label-dialog.component.css']
})
export class PrintLabelDialogComponent implements OnInit, AfterViewInit {
  selectedTemplate: any;
  templates: Observable<any[]>;
  isLoading = true;
  form: FormGroup;
  sizes = [
    {
      label: '80mm x 100mm',
      width: '80mm',
      heigth: '100mm'
    }
  ];
  constructor(public dialogRef: MatDialogRef<PrintLabelDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      template: new FormControl('', [Validators.required]),
      size: new FormControl('', [Validators.required]),
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
    this.close(this.form.value);
  }

  close(params = null) {
    this.dialogRef.close(params);
  }
}
