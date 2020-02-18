import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, catchError, retry } from 'rxjs/operators';
import { ItemsService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { HttpResponse } from '@angular/common/http';

export interface ValidationError {
  error: string;
  index: number;
}
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
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
  constructor(
    private dialog: MatDialog, private apiService: ItemsService,
    private utilities: UtilitiesService) {
      this.dataSource = new MatTableDataSource([]);
      this.filter = new FormControl('');
      this.dataValidationErrors = [];
      this.dataToSend = [];
      console.log('requesting items');
      this.apiService.retrieveAllItems('response', false).pipe(retry(3)/*, catchError(this.handleError)*/).subscribe(items => {
        console.log('items received', items);
        // this.dataSource.data = items;
      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleError(error: any) {
    console.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  renderColumnData(type: string, data: any) {
    return this.utilities.renderColumnData(type, data);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

}
