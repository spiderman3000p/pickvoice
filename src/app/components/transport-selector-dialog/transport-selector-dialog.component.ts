import { ViewChild, Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService} from '../../services/data-provider.service';
import { Transport } from '@pickvoice/pickvoice-api';
import { MyDataSource } from '../../models/my-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-transport-selector-dialog',
  templateUrl: './transport-selector-dialog.component.html',
  styleUrls: ['./transport-selector-dialog.component.css']
})
export class SearchTransportDialogComponent implements OnInit, AfterViewInit {
  dataSource: MyDataSource<Transport>;
  definitions = ModelMap.TransportMap;
  displayedColumns = ['transportNumber', 'transportRoute', 'transportShipmentDate', 'transportState'];
  pageSizeOptions = [5, 10, 15, 30, 50, 100];
  filtersForm: FormGroup;
  filters: any[] = [];
  filterParams = '';
  paginatorParams = '';
  sortParams = '';
  filteredDone = false;
  isLoadingResults = false;
  selectedTransport = {};
  states = Object.keys(Transport.TransportationStatusEnum)
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<SearchTransportDialogComponent>,
              private dataProviderService: DataProviderService, private utilities: UtilitiesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.filtersForm = new FormGroup({
      transportNumber: new FormControl(''),
      transportRoute: new FormControl(''),
      transportShipmentDate: new FormControl(''),
      transportState: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.dataSource = new MyDataSource(this.dataProviderService);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.loadDataPage();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(tap(() => this.loadDataPage()))
    .subscribe();
  }

  getFilterParams(): string {
    const formValues = this.filtersForm.value;
    this.utilities.log('filter form values: ', formValues);
    let filtersToUse = [];
    filtersToUse = Object.keys(this.filtersForm.controls).filter(key =>
      this.filtersForm.controls[key].value && this.filtersForm.controls[key].value.length > 0);

    const stringParams = filtersToUse.length > 0 ? filtersToUse.map(filterKey =>
      `${filterKey}-filterType=${filterKey.toLowerCase().includes('date') ? 'date' : 'text'};`
      + `${filterKey}-type=${filterKey.toLowerCase().includes('date') ? 'equals' : 'contains'};`
      + `${filterKey}-filter=${formValues[filterKey]}`)
      .join(';') : '';
    this.utilities.log('filters to use: ', filtersToUse);
    this.utilities.log('filters string params: ', stringParams);
    return stringParams;
  }

  close(toReturn: any) {
    this.dialogRef.close(toReturn);
  }

  getPaginatorParams(): string {
    const startRow = this.paginator.pageIndex * this.paginator.pageSize;
    return `startRow=${startRow};endRow=${startRow + this.paginator.pageSize}`;
  }

  getSortParams(): string {
    return `sort-${this.sort.active}=${this.sort.direction}`;
  }

  loadDataPage() {
    this.paginatorParams = this.getPaginatorParams();
    this.sortParams = this.getSortParams();
    const paramsArray = Array.of(this.paginatorParams, this.filterParams, this.sortParams)
    .filter(paramArray => paramArray.length > 0);
    // this.utilities.log('paramsArray', paramsArray);
    const params = paramsArray.length > 0 ? paramsArray.join(';') : '';
    // this.utilities.log('loading data with params', params);
    this.dataSource.loadData(IMPORTING_TYPES.TRANSPORTS, `${params}`)
    .subscribe((response: any) => {
        if (response.content) {
            this.dataSource.lastRow = response.pageSize;
            // this.dataSource.data = response.content.map(this.parserFn);
            this.dataSource.data = response.content;
            this.dataSource.dataCount = response.totalElements;
            this.dataSource.dataSubject.next(this.dataSource.data);
        }
    }, error => {
      this.utilities.error('Error fetching data from server');
      this.utilities.showSnackBar('Error fetching data from server', 'OK');
    });
  }

  reloadData() {
    this.loadDataPage();
  }

  applyFilters(): void {
    this.filterParams = this.getFilterParams();
    this.filteredDone = this.filterParams.length > 0;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
}
