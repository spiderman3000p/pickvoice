import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { ParseService } from '../../services/parse.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent {
  importType: string;
  fileInput: FormControl;
  urlInput: FormControl;
  apiType: FormControl;
  file: File;
  parsedData: any;
  isLoadingResults = false;
  dialogTitle = '';

  constructor(public dialogRef: MatDialogRef<ImportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private parseService: ParseService,
              private utilities: UtilitiesService, private httpClient: HttpClient) {
    this.file = {} as File;
    this.importType = this.data.type;

    if (this.importType === 'csv') {
      this.fileInput = new FormControl('', Validators.required);
      this.dialogTitle = 'Import File';
    }
    if (this.importType === 'url') {
      this.urlInput = new FormControl('', Validators.required);
      this.dialogTitle = 'Import Url';
    }
    if (this.importType === 'api') {
      this.urlInput = new FormControl('', Validators.required);
      this.apiType = new FormControl('', Validators.required);
      this.dialogTitle = 'Import Api';
    }
  }

  validateFile(files: FileList) {
    this.file = files[0];
    console.log('file', this.file);
    console.log('file size', this.file.size);
    console.log('file type', this.file.type);
    if (this.file.size > (5 * 1024 * 1024)) {
      this.utilities.showSnackBar('The file size is bigger than 5MB', 'OK');
    }
    if (this.file.type !== 'text/csv' && this.file.type !== 'application/vnd.ms-excel'
      && this.file.type !== 'application/csv' && this.file.type !== 'application/x-csv'
      && this.file.type !== 'text/x-csv' && this.file.type !== 'text/plain'
      && this.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.utilities.showSnackBar('The file format is invalid', 'OK');
    }
  }

  loadFile() {
    console.log('file attached', this.file);
    if (this.file.type.includes('text') || this.file.type.includes('csv') ||
        this.file.type.includes('application/vnd.ms-excel')) {
      this.isLoadingResults = true;
      this.parseService.parseFile(this.file, {
        header: true,
        skipEmptyLines: 'greedy', // greedy for skip all empty lines
        complete: (result) => {
          console.log('result', result);
          this.isLoadingResults = false;
          // parseamos los resultados para eliminar campos vacios en cada registro
          result.data.forEach((element, index) => {
            const object = {};
            Object.keys(element).forEach(field => {
              if (field.length > 0) {
                object[field] = element[field];
              }
            });
            result.data[index] = object;
          });
          console.log('parsed csv data', result.data);
          this.parsedData = result.data;
          const errors = result.errors.length;
          this.utilities.showSnackBar(`Data parsed successfully with ${errors} ommited rows`, 'OK');
          this.close();
        }
      });
    } else if (this.file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        || this.file.type.includes('application/vnd.ms-excel')) {
      this.isLoadingResults = true;
      readXlsxFile(this.file).then((rows) => {
        this.isLoadingResults = false;
        // `rows` is an array of rows
        // each row being an array of cells.
        const fields = Object.assign(rows[0]);
        rows.splice(0, 1);
        this.parsedData = rows.map((row, index) => {
          // return {...row};
          const object = {};
          fields.map((field, _index) => {
            object[field] = row[_index];
          });
          return object;
        });
        console.log('parsed xlsx data', this.parsedData);
        this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
        this.close();
      });
    }
  }

  loadUrl() {
    if (this.urlInput.value.endsWith('.csv') || this.urlInput.value.endsWith('.txt')) {
      this.isLoadingResults = true;
      this.parseService.parseUrl(this.urlInput.value, {
        download: true,
        header: true,
        complete: (result) => {
          this.isLoadingResults = false;
          console.log('parsed data', result);
          this.parsedData = result.data;
          const errors = result.errors.length;
          this.utilities.showSnackBar(`Data parsed successfully with ${errors} ommited rows`, 'OK');
          this.close();
        }
      });
    } else if (this.urlInput.value.endsWith('.xls') || this.urlInput.value.endsWith('.xlsx')) {
      this.isLoadingResults = true;
      this.httpClient.get(this.urlInput.value, { responseType: 'blob'}).pipe(
        tap(
          data => {
            console.log('data', data);
          },
          error => {
            console.error('error', error);
          }
        )
      ).subscribe(result => {
        console.log('resultado obtenido', result);
        console.log('tipo', typeof result);

        readXlsxFile(result).then((rows) => {
          this.isLoadingResults = false;
          // `rows` is an array of rows
          // each row being an array of cells.
          const fields = Object.assign(rows[0]);
          rows.splice(0, 1);
          this.parsedData = rows.map((row, index) => {
            // return {...row};
            const object = {};
            fields.map((field, _index) => {
              object[field] = row[_index];
            });
            return object;
          });
          console.log('parsed xlsx data', this.parsedData);
          this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
          this.close();
        });
      });
    } else {
      this.utilities.showSnackBar(`La extension del archivo en la url es inválida`, 'OK');
    }
  }

  loadApi() {
    if (this.apiType.value === 'xlsx') {
      this.httpClient.get(this.urlInput.value, { responseType: 'blob'}).pipe(
        tap(
          data => {
            console.log('data', data);
          },
          error => {
            console.error('error', error);
          }
        )
      ).subscribe(response => {
        console.log('resultado obtenido', response);
        console.log('tipo', typeof response);
        readXlsxFile(response).then((rows) => {
          this.isLoadingResults = false;
          // `rows` is an array of rows
          // each row being an array of cells.
          const fields = Object.assign(rows[0]);
          rows.splice(0, 1);
          this.parsedData = rows.map((row, index) => {
            // return {...row};
            const object = {};
            fields.map((field, _index) => {
              object[field] = row[_index];
            });
            return object;
          });
          console.log('parsed xlsx data', this.parsedData);
          this.utilities.showSnackBar(`Data parsed successfully`, 'OK');
          this.close();
        });
      });
    }
    if (this.apiType.value === 'csv') {
      this.parseService.parseFile(this.urlInput.value, {
        download: true,
        header: true,
        complete: (result) => {
          this.isLoadingResults = false;
          console.log('parsed data', result);
          this.parsedData = result.data;
          const errors = result.errors.length;
          this.utilities.showSnackBar(`Data parsed successfully with ${errors} ommited rows`, 'OK');
          this.close();
        }
      });
    } else {
      this.utilities.showSnackBar(`La extension del archivo en la url es inválida`, 'OK');
    }
  }

  onSubmit() {
    console.log('submiting');
    if (this.importType === 'csv') {
      this.loadFile();
    }
    if (this.importType === 'url') {
      this.loadUrl();
    }
    if (this.importType === 'api') {
      this.loadApi();
    }
  }

  close() {
    this.dialogRef.close(this.parsedData);
  }
}
