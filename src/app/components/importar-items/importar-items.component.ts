import { Component, OnInit, ViewChild } from '@angular/core';
import { ParseService } from '../../services/parse.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { EditRowDialogComponent } from '../edit-row-dialog/edit-row-dialog.component';
import { Item } from '../../models/item.d';
import { ItemType } from '../../models/itemType.d';
import { UnityOfMeasure } from '../../models/unityOfMeasure.d';
import { ModelMap } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, catchError, retry } from 'rxjs/operators';
import { ItemService } from '@pickvoice/pickvoice-api';
import { HttpResponse } from '@angular/common/http';

export interface ValidationError {
  error: string;
  index: number;
}
@Component({
  selector: 'app-importar-items',
  templateUrl: './importar-items.component.html',
  styleUrls: ['./importar-items.component.scss']
})
export class ImportarItemsComponent implements OnInit {
  headers: any = ModelMap.ItemMap;
  validationRequested = false;
  invalidRows: any[] = [];
  dataSource: MatTableDataSource<any>;
  dataToSend: Item[];
  displayedColumns = Object.keys(ModelMap.ItemMap);
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  isDataSaved = false;
  isReadyToSend = false;
  dataValidationErrors: ValidationError[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private dialog: MatDialog, private apiService: ItemService, private utilities: UtilitiesService) {
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl('');
    this.dataValidationErrors = [];
    this.dataToSend = [];
  }

  importFile(_type: string) {
    this.isDataSaved = false;
    this.isLoadingResults = true;
    const dialogRef = this.dialog.open(ImportDialogComponent,
      {
        data: {
          type: _type
        },
        width: '350px',
        height: '250px'
      });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoadingResults = false;
      if (result && result.length > 0) {
        console.log('data length:', result.length);
        console.log('expected data keys:', this.displayedColumns);
        const receivedKeys: any[] = Object.keys(result[0]);
        console.log('received data keys:', receivedKeys);

        if (!this.utilities.equalArrays(receivedKeys, this.displayedColumns)) {
          console.error('el formato de los datos recibidos no coincide con el formato esperado');
          this.utilities.showSnackBar('Error en el formato de los datos', 'OK');
          return;
        }
        this.dataSource.data = result;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendData() {
    console.log('start sending data proccess...');
    this.validateData();
    if (this.dataValidationErrors.length === 0 && this.isReadyToSend) {
      console.log('sending data to api...');
      this.isLoadingResults = true;
      this.apiService.createItemsWithList(this.dataToSend, 'response', true).pipe(
        retry(3)
      ).subscribe(result => {
        this.isLoadingResults = false;
        result = result as HttpResponse<any>;
        // result as HttpResponse is expected
        console.log('api call result', result);
        // status 201 is successfull response (CREATED)
        if (result && result.status === 201 && result.ok && result.statusText === 'Created') {
          this.isDataSaved = true;
          console.log('items created successfully');
          this.utilities.showSnackBar('Items saved successfully', 'OK');
         } else {
          this.isDataSaved = false;
          console.log('items could not be created');
          this.utilities.showSnackBar('Error saving items', 'OK');
        }
      });
    } else {
      console.error('Los datos no estan listos para ser enviados');
      this.utilities.showSnackBar('Los datos no estan listos para ser enviados', 'OK');
    }
  }

  handleError(error: any) {
    console.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  validateData() {
    if (this.dataSource.data.length > 0) {
      this.dataToSend = [];
      this.dataValidationErrors = [];
      this.invalidRows = [];
      let currentRowErrors = [];
      let errorFound: boolean;
      this.isLoadingResults = true;
      const copyData = this.dataSource.data.slice();

      console.log('dataSource es un array valido');

      copyData.forEach((row, rowIndex) => {
        const item = JSON.parse(JSON.stringify(row)) as Item;
        errorFound = false;
        currentRowErrors = [];
        for (const field in this.headers) {
          if (1) {
            // comprobando campos requeridos
            if (this.headers[field].required && (!row[field] || row[field].length === 0)) {
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `El campo ${this.headers[field].name} (${field}) es requerido`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              console.error(`No existe el campo ${field} en el registro ${rowIndex}`);
            }
            if (this.headers[field].min && row[field] < this.headers[field].min) {
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `El campo ${this.headers[field].name} (${field})
               debe ser mayor que ${this.headers[field].min}`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              console.error(`El campo ${this.headers[field].name} (${field})
              debe ser mayor que ${this.headers[field].min} en el registro ${rowIndex}`);
            }
            if (this.headers[field].max && row[field] > this.headers[field].max) {
              const validationError = new Object() as ValidationError;
              validationError.index = rowIndex;
              validationError.error = `El campo ${this.headers[field].name} (${field})
               debe ser menor que ${this.headers[field].max}`;
              this.dataValidationErrors.push(validationError);
              currentRowErrors.push(validationError);
              errorFound = true;
              console.error(`El campo ${this.headers[field].name} (${field})
              debe ser menor que ${this.headers[field].max} en el registro ${rowIndex}`);
            }
            if (field === 'itemType') {
              item[field] = new Object() as ItemType;
              item[field].code = row[field] as string;
              item[field].name = '';
            }
            if (field === 'uom') {
              item[field] = new Object() as UnityOfMeasure;
              item[field].code = row[field] as string;
              item[field].name = '';
            }
          }
        }
        // omitimos el registro si hay algun error de validacion en él
        this.dataSource.data[rowIndex].index = rowIndex;
        if (errorFound) {
          this.invalidRows.push({ row: rowIndex, errors: currentRowErrors.slice() });
          this.dataSource.data[rowIndex].invalid = true;
          this.dataSource.data[rowIndex].tooltip = currentRowErrors.slice().map((_row, _index) => {
            return _row.error + ((_index < (currentRowErrors.length - 1)) ? ',' : '');
          }).toString();
          console.error(`row ${rowIndex} invalida`, this.dataSource.data[rowIndex]);
          return;
        } else {
          this.dataSource.data[rowIndex].tooltip = null;
          this.dataSource.data[rowIndex].invalid = false;
          console.log(`row ${rowIndex} valida`, this.dataSource.data[rowIndex]);
        }
        // lo añadimos a la lista de datos a enviar, en caso de que cumpla con todas las validaciones
        this.dataToSend.push(item);
      });

      this.validationRequested = true;
      this.isLoadingResults = false;
      this.isReadyToSend = this.dataValidationErrors.length === 0;
      console.log('data to send', this.dataToSend);
      console.log('ready to send? ', this.isReadyToSend);
      console.log('validation errors', this.dataValidationErrors);
      console.log('validation errors per row', this.invalidRows);
      if (this.dataValidationErrors.length > 0) {
        this.utilities.showSnackBar(`Se importaron todos los registros excepto ${this.invalidRows.length} registros invalidos`, 'OK');
      }
    } else {
      console.log('No hay datos en la tabla');
      this.utilities.showSnackBar(`No hay datos para importar`, 'OK');
    }
  }

  editRow(index: number) {
    const dialogRef = this.dialog.open(EditRowDialogComponent, { data: { row: this.dataSource.data[index], map: ModelMap.ItemMap}});
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog result:', result);
      if (result) {
        Object.keys(result).forEach(key => {
          this.dataSource.data[index][key] = result[key];
        });
      }
    });
  }

  getValidationAlertMessage() {
    return this.dataValidationErrors.length > 0 ?
    `Hay ${this.invalidRows.length} registros inválidos que debe corregir. Por favor revise, corrija y reintente nuevamente` :
    'Datos validados correctamente. Presione Siguiente para continuar';
  }

  getValidateBtnText() {
    if (this.dataSource.data.length > 0 && !this.isReadyToSend) {
      if (!this.isLoadingResults) {
        if (!this.validationRequested) {
          return 'Validate';
        } else {
          return 'Validate Again';
        }
      } else {
        return 'Validating...';
      }
    }
    if (this.dataSource.data.length > 0 && this.isReadyToSend && !this.isLoadingResults) {
      return 'Next';
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
