import { ViewChild, Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelMap, IMPORTING_TYPES, FILTER_TYPES } from '../../models/model-maps.model';
import { Lpn, LpnInterval, LpnItem } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { STATES } from '../../models/model-maps.model';

@Component({
  selector: 'app-generate-lpn-interval-dialog',
  templateUrl: './generate-lpn-interval-dialog.component.html',
  styleUrls: ['./generate-lpn-interval-dialog.component.css']
})
export class GenerateLpnIntervalDialogComponent implements OnInit, AfterViewInit {
  types: Observable<any[]>;
  states: Observable<any[]>;
  isLoading = false;
  form: FormGroup;
  STATES = STATES;
  templates: any[];
  constructor(public dialogRef: MatDialogRef<GenerateLpnIntervalDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup({
      type: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      print: new FormControl(false),
      template: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.dataProviderService.getAllTemplates().subscribe(results => {
      this.templates = results;
    });
  }

  ngAfterViewInit() {
  }

  loadData() {
    this.types = this.dataProviderService.getAllLpnTypes();
    this.states = this.dataProviderService.getAllLpnStates();
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utilities.log('formulario:', this.form.value);
      this.utilities.error('formulario invalido');
      this.utilities.showSnackBar('Please check the required fields', 'OK');
      return;
    }
    this.isLoading = true;
    const dataToUpload = Object.assign({}, this.form.value);
    delete dataToUpload.print;
    delete dataToUpload.template;
    this.dataProviderService.createLpns(dataToUpload).subscribe((result: any) => {
      this.isLoading = false;
      // this.utilities.log('Respuesta generar lpn: ', result);
      if (result) {
        this.utilities.showSnackBar('Lpn gerated successfully', 'OK');
        if (this.form.get('print').value) {
          let htmlContent = '';
          const jsonTemplate = JSON.parse(this.form.value.template.jsonTemplate);
          this.utilities.log('jsonTemplate:', jsonTemplate);
          result.forEach((lpn, index) => {
            htmlContent += index > 0 && index < result.length - 1 ? '<div class="page-break"></div>' : '';
            htmlContent += this.utilities.generateHtmlLpnContent(lpn, jsonTemplate['gjs-html']);
          });
          const cssStyles = jsonTemplate['gjs-css'];
          // this.utilities.log('html to print:', htmlContent);
          // this.utilities.log('css to print:', cssStyles);
          this.utilities.print(`Labels`, htmlContent, cssStyles,
          '80mm', '100mm');
        }
        this.dialogRef.close(this.form.value);
      }
    }, error => {
      this.isLoading = false;
      const errorMessage = error.error.message ? error.error.message : 'Error generating Lpn';
      this.utilities.showSnackBar(errorMessage, 'OK');
      this.utilities.error('Error al generar lpn: ', error);
    });
  }
}
