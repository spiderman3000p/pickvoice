import { OnDestroy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { AddRowDialogComponent } from '../../components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from '../../components/edit-row-dialog/edit-row-dialog.component';
import { EditRowComponent } from '../../pages/edit-row/edit-row.component';
import { Lpns } from '../../models/lpns.model';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';

import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { retry, takeLast, take } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, Observable, merge, Observer, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lpns',
  templateUrl: './lpns.component.html',
  styleUrls: ['./lpns.component.css']
})
export class LpnsComponent implements OnInit, AfterViewInit, OnDestroy {
  definitions: any = ModelMap.LpnListMap;
  dataToSend: Lpns[];
  filter: FormControl;
  filtersForm: FormGroup;
  showFilters: boolean;
  filters: any[] = [];
  actionForSelected: FormControl;
  isLoadingResults = false;
  isLoadingLpnsDetail = false;
  selection = new SelectionModel<any>(true, []);
  type = IMPORTING_TYPES.LPN_LIST;
  selectsData: any;
  subscriptions: Subscription[] = [];
  selectedLpns: any;
  nodes = [];
  options = {};
  constructor(
    private dialog: MatDialog, private dataProviderService: DataProviderService, private router: Router,
    private utilities: UtilitiesService) {
      this.filter = new FormControl('');
      this.dataToSend = [];
      this.actionForSelected = new FormControl('');

      this.utilities.log('filters', this.filters);
      this.subscriptions.push(this.actionForSelected.valueChanges.subscribe(value => {
        this.actionForSelectedRows(value);
      }));
      this.filtersForm = new FormGroup({
        code: new FormControl(''),
        type: new FormControl(''),
        state: new FormControl(''),
        interface: new FormControl(''),
        labelWithMaterial: new FormControl(''),
        location: new FormControl('')
      });
      this.selectedLpns = {};
      this.selectsData = {};
      this.selectsData.type = [];
      this.selectsData.code = [];
      this.selectsData.location = [];
      this.selectsData.interface = [];
      this.selectsData.state = [];
      this.loadData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  viewLpnsDetail(event: any) {
    const lpns = event.node.data;
    this.utilities.log('data: ', lpns);
    this.selectedLpns = {};
    if (lpns.id && lpns.id.includes('IT')) {
      this.isLoadingLpnsDetail = true;
      const id = lpns.id.replace('IT', '');
      this.dataProviderService.getLpn(id).subscribe(result => {
        this.isLoadingLpnsDetail = false;
        this.utilities.log('lpns details: ', result);
        if (result && result.content && result.content.length > 0 && result.content[0].lpnItemId) {
          this.selectedLpns = result.content[0];
        }
      });
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    // return numSelected === numRows;
    return true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected() ? this.selection.clear() : this.selection.clear();
    // this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  actionForSelectedRows(action) {
    this.utilities.log('action selected', action);
    switch (action) {
      case 'delete':
        if (this.selection.selected.length > 0) {
          this.deletePrompt(this.selection.selected);
        } else {
          this.utilities.showSnackBar('You have no selected records', 'OK');
        }
        break;
      default: break;
    }
  }

  deleteRow(row: any) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    }
    return true;
  }

  deleteRows(rows: any) {
    let deletedCounter = 0;
    let errorsCounter = 0;
    let constraintErrors = false;
    const observables: Observable<any>[] = [];
    const allOperationsSubject = new Subject();
    allOperationsSubject.subscribe((operation: any) => {
      if (operation.type === 'success') {
        deletedCounter++;
      }
      if (operation.type === 'error') {
        errorsCounter++;
      }
      if (deletedCounter === (Array.isArray(rows) ? rows.length : 1)) {
        this.utilities.showSnackBar((Array.isArray(rows) ? 'Rows' : 'Row') + ' deleted successfully 1', 'OK');
      } else {
        if (deletedCounter === 0 && errorsCounter === (Array.isArray(rows) ? rows.length : 1)) {
          this.utilities.showSnackBar(constraintErrors ? 'Error on delete selected rows because there are' +
          ' in use' : 'Error on delete rows, check Internet conection', 'OK');
        } else if (deletedCounter > 0 && errorsCounter > 0 &&
                   deletedCounter + errorsCounter >= (Array.isArray(rows) ? rows.length : 1)) {
          this.utilities.showSnackBar('Some rows could not be deleted', 'OK');
        }
      }
    }, error => null,
    () => {
    });
    const observer = {
      next: (result) => {
        this.utilities.log('Row deleted: ', result);
        if (result) {
          this.deleteRow(rows);
          this.utilities.log('Row deleted');
          allOperationsSubject.next({type: 'success'});
        }
      },
      error: (error) => {
        this.utilities.error('Error on delete rows', error);
        if (error) {
          if (error.error.message.includes('constraint')) {
            constraintErrors = true;
          }
          allOperationsSubject.next({type: 'error'});
        }
      },
      complete: () => {
        // allOperationsSubject.complete();
      }
    } as Observer<any>;
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        this.subscriptions.push(this.dataProviderService.deleteLpn(row.id, 'response', false).pipe(take(1))
        .subscribe(observer));
      });
    } else {
      this.subscriptions.push(this.dataProviderService.deleteLpn(rows.id, 'response', false).pipe(take(1))
      .subscribe(observer));
    }
  }

  deletePrompt(rows?: any) {
    const observer = {
      next: (result) => {
        if (result) {
          this.deleteRows(rows);
        }
      },
      error: (error) => {

      }
    } as Observer<boolean>;
    this.utilities.showCommonDialog(observer, {
      title: 'Delete Row',
      message: 'You are about to delete this record(s). Are you sure to continue?'
    });
  }

  resetFilters() {
    this.filtersForm.reset();
  }

  applyFilters() {
    const formValues = this.filtersForm.value;
    // this.utilities.log('filter form values: ', formValues);
    const filters = this.filters.filter(filter => filter.show &&
                    formValues[filter.key] && formValues[filter.key].length > 0);
    // this.utilities.log('filters: ', filters);
  }

  editRowOnPage(element: any) {
    this.utilities.log('row to send to edit page', element);
    this.router.navigate([`${element.id}`]);
  }

  editRowOnDialog(element: any) {
    this.utilities.log('row to send to edit dialog', element);
    const dialogRef = this.dialog.open(EditRowDialogComponent, {
      data: {
        row: element,
        map: ModelMap.LpnMap,
        type: IMPORTING_TYPES.LPN,
        remoteSync: true // para mandar los datos a la BD por la API
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
            /*this.dataSource.data[element.index] = result;
            this.refreshTable();*/
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  loadData(useCache = true) {
    this.utilities.log('requesting Lpns');
    this.isLoadingResults = true;
    const newData = [];
    let results = [];
    this.subscriptions.push(this.dataProviderService.getAllLpns().subscribe((res: any) => {
      this.isLoadingResults = false;
      this.utilities.log('lpns received', results);
      if (res && res.content && res.content.length > 0) {
        results = res.content;
      } else if (res) {
        results = res;
      }
      results.slice().forEach((element, index) => {
        if (element.root == null) {
          newData.push({
            id: element.id,
            name: element.description,
            children: []
          });
          results.splice(index, 1);
        }
      });
      let aux;
      let auxIndex;
      results.slice().forEach((element, index) => {
        if (element.root != null) {
          auxIndex = newData.findIndex(el => el.id === element.root);
          if (auxIndex > -1) {
            aux = newData[auxIndex];
            aux.children.push({
              id: element.id,
              name: element.description,
              children: []
            });
            results.splice(index, 1);
          }
        }
      });
      this.utilities.log('newData: ', newData);
      this.nodes = newData;
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('error on requesting data');
      this.utilities.showSnackBar('Error requesting data', 'OK');
    }));
  }

  reloadData() {
    this.selection.clear();
    this.loadData(false);
  }

  addRow() {
    this.utilities.log('map to send to add dialog',
    this.utilities.dataTypesModelMaps.lpn);
    const dialogRef = this.dialog.open(AddRowDialogComponent, {
      data: {
        map: ModelMap.LpnMap,
        type: IMPORTING_TYPES.LPN,
        remoteSync: true, // para mandar los datos a la BD por la API
        title: 'Add New LPNS'
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {
        /*this.dataSource.data.push(result);
        this.refreshTable();*/
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
      this.isLoadingResults = false;
    }));
  }

  export() {
    /*const dataToExport = this.dataSource.data.map((row: any) => {
      return this.utilities.getJsonFromObject(row, this.type);
    });
    this.utilities.exportToXlsx(dataToExport, 'Lpns List');*/
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }
}
