import { OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { AuthService } from '../../services/auth.service';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from '../../components/importing-widget/importing-widget.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { ModelMap } from '../../models/model-maps.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ItemService, Item, ItemType, UnityOfMeasure } from '@pickvoice/pickvoice-api';
import { DataProviderService } from '../../services/data-provider.service';
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { Module } from '@ag-grid-community/core';

// or if using ag-Grid Enterprise
ModuleRegistry.registerModules(AllModules);

interface TimePeriod {
  value: number;
  title: string;
}
interface AgGridData {
  rowData: any[];
  colDefs: any[];
  defaultColDef: any[];
  sideBar: any;
  statusBar: any;
}
interface GridWindow {
    id: string;
    title: string;
    isLoading: boolean;
    expanded: boolean;
    position: number;
    period: TimePeriod;
    data: AgGridData;
    gridApi: any;
    gridColumnApi: any;
}
@Component({
  selector: 'app-picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.css']
})
export class PickingComponent implements OnDestroy {
  periods: TimePeriod[];
  windows: GridWindow[];
  agGridModules: Module[] = AllModules;
  subscriptions: Subscription[] = [];
  constructor(private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              private authService: AuthService) {
      this.initWindows();
      this.initPeriods();
      console.log('periods', this.periods);
  }

  onGridReady(params, window: GridWindow) {
    window.gridApi = params.api;
    window.gridColumnApi = params.columnApi;
    this.getData();
  }

  getData(window?: GridWindow) {
    this.utilities.log('requesting data');
    const owner = this.authService.userData.ownerId;
    if (!window) {
      if (owner !== null) {
        this.windows.forEach(loader => loader.isLoading = true);
        this.subscriptions.push(this.dataProviderService.getAllItems('response', false)
        .pipe(retry(3)/*, catchError(this.handleError)*/)
        .subscribe((response: any) => {
          this.windows.forEach(loader => loader.isLoading = false);
          this.utilities.log('items received', response.body);
          if (response.body.length > 0) {
            const colDefs = Object.keys(response.body[0]).map(col => {
              return {
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
                field: col,
                editable: true,
                show: true
              };
            });
            this.utilities.log('columnDefs sortable', colDefs);
            const sideBar = {
              toolPanels: [
                'filters',
                {
                  id: 'columns',
                  labelDefault: 'Columns',
                  labelKey: 'columns',
                  iconKey: 'columns',
                  toolPanel: 'agColumnsToolPanel',
                  toolPanelParams: { suppressSyncLayoutWithGrid: true }
                }
              ]
            };
            const statusBar = {
              statusPanels: [
                {
                  statusPanel: 'agTotalRowCountComponent',
                  align: 'left',
                  key: 'totalRowComponent'
                },
                {
                  statusPanel: 'agFilteredRowCountComponent',
                  align: 'left'
                },
                {
                  statusPanel: 'agSelectedRowCountComponent',
                  align: 'center'
                },
                {
                  statusPanel: 'agAggregationComponent',
                  align: 'right'
                }
              ]
            };
            this.windows.forEach(_window => {
              _window.isLoading = false;
              _window.data.rowData = JSON.parse(JSON.stringify(response.body));
              _window.data.colDefs = JSON.parse(JSON.stringify(colDefs));
              _window.data.defaultColDef = JSON.parse(JSON.stringify(colDefs));
              _window.data.sideBar = Object.assign(sideBar);
              _window.data.statusBar = Object.assign(statusBar);
            });
            console.log('all windows', this.windows);
          }
        }, error => {
          this.windows.forEach(loader => loader.isLoading = false);
          this.utilities.error('error on requesting data');
          this.utilities.showSnackBar('Error requesting data', 'OK');
        }));
      }
    } else {
      if (owner !== null) {
        window.isLoading = true;
        this.subscriptions.push(this.dataProviderService.getAllItems('response', false)
        .pipe(retry(3)/*, catchError(this.handleError)*/)
          .subscribe((response: any) => {
            window.isLoading = true;
            this.utilities.log('items received', response.body);
            if (response.body.length > 0) {
              window.data.rowData = response.body;
            }
          }, error => {
            window.isLoading = false;
            this.utilities.error('error on requesting data');
            this.utilities.showSnackBar('Error requesting data', 'OK');
          })
        );
      }
    }
  }

  initPeriods() {
    this.periods = [];
    const periods = [7, 15, 30, 90, 180, 365];
    let periodAux: TimePeriod;
    let periodText: string;
    for (const period of periods) {
      periodAux = new Object() as TimePeriod;
      periodAux.value = period;
      switch (period ) {
        case 30: periodText = 'Last month'; break;
        case 90: periodText = 'Last 3 months'; break;
        case 180: periodText = 'Last 6 months'; break;
        case 365: periodText = 'Last year'; break;
        default: periodText = `Last ${period} days`;
      }
      periodAux.title = periodText;
      this.periods.push(periodAux);
    }
  }

  initWindows() {
    this.windows = [];
    let windowAux: GridWindow;
    for (let i = 0; i < 4; i++) {
      windowAux = new Object() as GridWindow;
      windowAux.id = `window_${i + 1}`;
      windowAux.title = `Resumen de asignacion de seleccion ${i + 1}`;
      windowAux.isLoading = false;
      windowAux.expanded = false;
      windowAux.position = i,
      windowAux.period = new Object() as TimePeriod,
      windowAux.data = new Object() as AgGridData;
      this.windows.push(windowAux);
    }
  }

  handleError(error: any) {
    this.utilities.error('error sending data to api', error);
    this.utilities.showSnackBar('Error on request. Verify your Internet connection', 'OK');
  }

  renderColumnData(type: string, data: any) {
    return this.utilities.renderColumnData(type, data);
  }

  editRow(index: number) {
  }

  expandWindow(window: any) {
    const sortFunc = (a, b) => {
      if (a.position < b.position) {
        return -1;
      }
      if (a.position > b.position) {
        return 1;
      }
      return 0;
    };
    // si se va aexpandir, insertamos el window seleccionado al inicio del array
    if (!window.expanded) {
      // hacemos una copia del window seleccionado
      const aux = Object.assign(window);
      // minimizamos todas las ventana
      this.windows.forEach(_window => _window.expanded = false);
      // ordenamos el array
      this.windows.sort(sortFunc);
      // marcamos el window seleccionado como expandido/contraido
      aux.expanded = true;
      // elimino el window del array
      this.windows.splice(this.windows.findIndex(_window => _window.position === aux.position), 1);
      // lo inserto nuevamente en el primer puesto
      this.windows.splice(0, 0, aux);
      // terminamos
    } else {
      // sino, lo marcamos como contraido y ordenamos el array segun las posiciones originales
      window.expanded = false;
      this.windows.sort(sortFunc);
    }
  }

  getLastSelectedPeriod(window: any) {
    let configWindow = JSON.parse(localStorage.getItem(window.id));

    configWindow = !configWindow ? {} : configWindow;

    configWindow.period = this.periods[0];
    localStorage.setItem(window.id, JSON.stringify(configWindow));
    return  configWindow.period.value;
  }

  selectPeriod(window: GridWindow, period: TimePeriod) {
    let configWindow = JSON.parse(localStorage.getItem(window.id));
    configWindow = !configWindow ? {} : configWindow;
    configWindow.period = period;
    localStorage.setItem(window.id, JSON.stringify(configWindow));
    window.period = period;
    this.getData(window);
  }

  reloadData() {
  }

  toggleColumn(window: GridWindow, column?: any){
    console.log('displayed column until now', window.data.colDefs);
    if (column) {
      column.show = !column.show;
      window.data.colDefs = window.data.defaultColDef.filter(col => col.show);
    } else {
      window.data.defaultColDef.forEach(col => col.show = true);
      window.data.colDefs = JSON.parse(JSON.stringify(window.data.defaultColDef));
    }
    console.log('displayed column after', window.data.colDefs);
    window.gridApi.setColumnDefs(window.data.colDefs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
