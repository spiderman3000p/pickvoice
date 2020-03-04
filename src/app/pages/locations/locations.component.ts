import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { ModelMap } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { LocationsService, Location } from '@pickvoice/pickvoice-api';
import { Observable, Subject } from 'rxjs';

export interface ValidationError {
  error: string;
  index: number;
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  headers: any = ModelMap.LocationMap;
  validationRequested = false;
  invalidRows: any[] = [];
  dataSource: MatTableDataSource<Location>;
  dataToSend: Location[];
  displayedColumns = Object.keys(ModelMap.LocationMap);
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  isDataSaved = false;
  isReadyToSend = false;
  dataValidationErrors: ValidationError[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  constructor(
    private dialog: MatDialog, private apiService: LocationsService,
    private utilities: UtilitiesService) {
      this.dataSource = new MatTableDataSource<Location>();
      this.filter = new FormControl('');
      this.dataValidationErrors = [];
      this.dataToSend = [];
      this.isLoadingResults = true;
      this.utilities.log('requesting locations');
      this.apiService.retrieveAllLocation('response', false).pipe(retry(3)/*, catchError(this.handleError)*/)
      .subscribe(response => {
        this.isLoadingResults = false;
        this.utilities.log('locations received', response.body);
        this.dataSource.data = response.body.map((element, i) => {
          return { index: i, ... element};
        });
      }, error => {
        this.utilities.error('Error on requesting locations');
        this.isLoadingResults = false;
        this.utilities.showSnackBar('Error requesting data', 'OK');
      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*
    Esta funcion se encarga de refrescar la tabla cuando el contenido cambia.
    TODO: mejorar esta funcion usando this.dataSource y no el filtro
  */
  private refreshTable() {
    // If there's no data in filter we do update using pagination, next page or previous page
    if (this.dataSource.filter === '') {
      const aux = this.dataSource.filter;
      this.dataSource.filter = 'XXX';
      this.dataSource.filter = aux;
      // If there's something in filter, we reset it to 0 and then put back old value
    } else {
      const aux = this.dataSource.filter;
      this.dataSource.filter = '';
      this.dataSource.filter = aux;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
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

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.locations);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.locations,
        type: 'locations',
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        this.dataSource.data.push(result);
        this.refreshTable();
        // this.table.renderRows();
        // this.dataSource = new MatTableDataSource(result);
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  editRow(index: number) {
    const dialogRef = this.dialog.open(EditRowDialogComponent,
      {
        data:
        {
          row: this.dataSource.data[index],
          map: ModelMap.LocationMap,
          type: 'locations',
          remoteSync: true // para mandar los datos a la BD por la API
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        /*Object.keys(result).forEach(key => {
          this.dataSource.data[index][key] = result[key];
        });*/
        this.dataSource.data[index] = result;
        this.refreshTable();
        // this.table.renderRows();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
    
  }
}
