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
import { retry } from 'rxjs/operators';
import { ItemsService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';

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
  dataSource: MatTableDataSource<Item>;
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
      this.isLoadingResults = true;
      this.apiService.retrieveAllItems('response', false).pipe(retry(3)/*, catchError(this.handleError)*/)
      .subscribe(response => {
        this.isLoadingResults = false;
        console.log('items received', response.body);
        this.dataSource.data = response.body.map((element, index) => {
          return { index: index, ... element};
        });
      }, error => {
        this.isLoadingResults = false;
        console.error('error on requesting data');
        this.utilities.showSnackBar('Error on requesting data', 'OK');
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
    console.log('row to send to edit dialog', this.dataSource.data[index]);
    console.log('map to send to edit dialog',
    this.utilities.dataTypesModelMaps.items);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: this.dataSource.data[index],
        map: this.utilities.dataTypesModelMaps.items,
        type: 'items',
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog result:', result);
      if (result) {
        /*
          Aqui la asignacion del array de objetos deberia ser tan sencillo como: this.dataSource.data = result
          Pero de esa forma no se refresca la tabla. Asi que la unica forma para que se reflejen los cambios
          inmediatamente en la tabla es editando registro por registro. Para eso usamos un ForEach
        */
        Object.keys(result).forEach(key => {
          if (key === 'itemType' || key === 'uom') {
            this.dataSource.data[index][key].code = result[key];
          } else {
            this.dataSource.data[index][key] = result[key];
          }
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
