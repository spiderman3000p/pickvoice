import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-save-template-dialog',
  templateUrl: './save-template-dialog.component.html',
  styleUrls: ['./save-template-dialog.component.css']
})
export class SaveTemplateDialogComponent implements OnInit, AfterViewInit {
  title: string;
  message: string;
  types: Observable<any[]>;
  isLoading = true;
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<SaveTemplateDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      labelTypeId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      enableDate: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.types = this.dataProviderService.getAllTemplateTypes()
    .pipe(finalize(() => this.isLoading = false));
  }

  ngAfterViewInit() {
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('formulario:', this.form.value);
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    const data = this.form.value;
    data.labelTypeId = Number(data.labelTypeId);
    this.dialogRef.close(data);
  }
}
