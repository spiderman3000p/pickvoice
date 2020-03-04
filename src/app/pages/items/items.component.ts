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
import { ItemsService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  headers: any = ModelMap.ItemMap;
  dataSource: MatTableDataSource<Item>;
  dataToSend: Item[];
  displayedColumns = Object.keys(ModelMap.ItemMap);
  pageSizeOptions = [5, 10]; // si se mustran mas por pantalla se sale del contenedor
  filter: FormControl;
  isLoadingResults = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private dialog: MatDialog, private apiService: ItemsService,
    private utilities: UtilitiesService) {
      this.dataSource = new MatTableDataSource([]);
      this.filter = new FormControl('');
      this.dataToSend = [];
      this.utilities.log('requesting items');
      this.isLoadingResults = true;
      this.apiService.retrieveAllItems('response', false).pipe(retry(3)/*, catchError(this.handleError)*/)
      .subscribe(response => {
        this.isLoadingResults = false;
        this.utilities.log('items received', response.body);
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
      this.utilities.log('dialog result:', result);
      if (result) {
            this.dataSource.data[index] = result;
            this.refreshTable();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    });
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.items);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: this.utilities.dataTypesModelMaps.items,
        type: 'items',
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
