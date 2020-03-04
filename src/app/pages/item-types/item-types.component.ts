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
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { ItemTypeService, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.css']
})
export class ItemTypesComponent implements OnInit {

  headers: any = ModelMap.ItemTypeMap;
  dataSource: MatTableDataSource<ItemType>;
  dataToSend: ItemType[];
  displayedColumns = Object.keys(ModelMap.ItemTypeMap);
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dialog: MatDialog, private apiService: ItemTypeService,
    private utilities: UtilitiesService) {
      this.dataSource = new MatTableDataSource([]);
      this.filter = new FormControl('');
      this.dataToSend = [];
      this.utilities.log('requesting item types');
      this.isLoadingResults = true;
      this.apiService.retrieveAllItemTypes('response', false).pipe(retry(3)/*, catchError(this.handleError)*/)
      .subscribe(response => {
        this.isLoadingResults = false;
        this.utilities.log('item types received', response.body);
        this.dataSource.data = response.body.map((element, i) => {
          return { index: i, ... element};
        });
      }, error => {
        this.isLoadingResults = false;
        this.utilities.error('error on requesting data');
        this.utilities.showSnackBar('Error requesting data', 'OK');
      });
  }

  ngOnInit() {
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

  editRow(index: number) {
    this.utilities.log('row to send to edit dialog', this.dataSource.data[index]);
    this.utilities.log('map to send to edit dialog',
    this.utilities.dataTypesModelMaps.itemTypes);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: this.dataSource.data[index],
        map: this.utilities.dataTypesModelMaps.itemTypes,
        type: 'itemTypes',
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        /*
          Aqui la asignacion del array de objetos deberia ser tan sencillo como: this.dataSource.data = result
          Pero de esa forma no se refresca la tabla. Asi que la unica forma para que se reflejen los cambios
          inmediatamente en la tabla es editando registro por registro. Para eso usamos un ForEach
        */
        Object.keys(result).forEach(key => {
            this.dataSource.data[index][key] = result[key];
        });
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
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
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
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
}
