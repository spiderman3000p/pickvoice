import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-recent-origins',
  templateUrl: './recent-origins.component.html',
  styleUrls: ['./recent-origins.component.css']
})
export class RecentOriginsComponent implements OnInit, OnDestroy {
  itemsDtoDataSource: MatTableDataSource<RecentOrigin>;
  locationsDtoDataSource: MatTableDataSource<RecentOrigin>;
  ordersDtoDataSource: MatTableDataSource<RecentOrigin>;
  loadPicksDtoDataSource: MatTableDataSource<RecentOrigin>;
  itemUomsDtoDataSource: MatTableDataSource<RecentOrigin>;
  displayedColumns = Object.keys(ModelMap.RecentOriginMap);
  headers: any = ModelMap.RecentOriginMap;
  filter: FormControl;
  isLoadingResults = false;
  subscribers: Subscription[] = [];
  importingTypes = IMPORTING_TYPES;
  @ViewChild(MatPaginator, {static: true}) itemsPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) locationsPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) ordersPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) loadPicksPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) itemUomsPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) itemsSort: MatSort;
  @ViewChild(MatSort, {static: true}) locationsSort: MatSort;
  @ViewChild(MatSort, {static: true}) ordersSort: MatSort;
  @ViewChild(MatSort, {static: true}) loadPicksSort: MatSort;
  @ViewChild(MatSort, {static: true}) itemUomsSort: MatSort;
  @ViewChild(MatPaginator) set matItemsPaginator(mp: MatPaginator) {
    this.itemsPaginator = mp;
    this.initItemsPaginatorSort();
  }
  @ViewChild(MatPaginator) set matLocationsPaginator(mp: MatPaginator) {
    this.locationsPaginator = mp;
    this.initLocationsPaginatorSort();
  }
  @ViewChild(MatPaginator) set matOrdersPaginator(mp: MatPaginator) {
    this.ordersPaginator = mp;
    this.initOrdersPaginatorSort();
  }
  @ViewChild(MatPaginator) set matLoadPicksPaginator(mp: MatPaginator) {
    this.loadPicksPaginator = mp;
    this.initLoadPicksPaginatorSort();
  }
  @ViewChild(MatPaginator) set matItemUomsPaginator(mp: MatPaginator) {
    this.itemUomsPaginator = mp;
    this.initItemUomsPaginatorSort();
  }
  @ViewChild(MatSort) set matItemsSort(ms: MatSort) {
    this.itemsSort = ms;
    this.initItemsPaginatorSort();
  }
  @ViewChild(MatSort) set matLocationsSort(ms: MatSort) {
    this.locationsSort = ms;
    this.initLocationsPaginatorSort();
  }
  @ViewChild(MatSort) set matOrdersSort(ms: MatSort) {
    this.ordersSort = ms;
    this.initOrdersPaginatorSort();
  }
  @ViewChild(MatSort) set matLoadPicksSort(ms: MatSort) {
    this.loadPicksSort = ms;
    this.initLoadPicksPaginatorSort();
  }
  @ViewChild(MatSort) set matItemUomsSort(ms: MatSort) {
    this.itemUomsSort = ms;
    this.initItemUomsPaginatorSort();
  }
  constructor(private recentOriginsService: RecentOriginsService, private utilities: UtilitiesService) {
    this.itemsDtoDataSource = new MatTableDataSource([]);
    this.locationsDtoDataSource = new MatTableDataSource([]);
    this.ordersDtoDataSource = new MatTableDataSource([]);
    this.loadPicksDtoDataSource = new MatTableDataSource([]);
    this.itemUomsDtoDataSource = new MatTableDataSource([]);

    const itemsObserver = {
      next: (origins) => {
        this.utilities.log('items results type ', typeof origins);
        this.utilities.log('items recent origins', origins);
        this.itemsDtoDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting items recent origins: ', error);
        this.utilities.showSnackBar('Error requesting items recent origins', 'OK');
      }
    };

    const locationsObserver = {
      next: (origins) => {
        this.utilities.log('locations results type ', typeof origins);
        this.utilities.log('locations recent origins', origins);
        this.locationsDtoDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting locations recent origins: ', error);
        this.utilities.showSnackBar('Error requesting locations recent origins', 'OK');
      }
    };

    const ordersObserver = {
      next: (origins) => {
        this.utilities.log('orders results type ', typeof origins);
        this.utilities.log('orders recent origins', origins);
        this.ordersDtoDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting orders recent origins: ', error);
        this.utilities.showSnackBar('Error requesting orders recent origins', 'OK');
      }
    };
    const loadPicksObserver = {
      next: (origins) => {
        this.utilities.log('load picks results type ', typeof origins);
        this.utilities.log('load picks recent origins', origins);
        this.loadPicksDtoDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting load picks recent origins: ', error);
        this.utilities.showSnackBar('Error requesting load picks recent origins', 'OK');
      }
    };
    const itemUomsObserver = {
      next: (origins) => {
        this.utilities.log('item uoms results type ', typeof origins);
        this.utilities.log('item uoms recent origins', origins);
        this.itemUomsDtoDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting item uoms recent origins: ', error);
        this.utilities.showSnackBar('Error requesting item uoms recent origins', 'OK');
      }
    };

    this.subscribers.push(this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADITEMS_DTO).
    subscribe(itemsObserver));
    this.subscribers.push(this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADLOCATIONS_DTO).
    subscribe(locationsObserver));
    this.subscribers.push(this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADORDERS_DTO).
    subscribe(ordersObserver));
    this.subscribers.push(this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADPICKS_DTO).
    subscribe(loadPicksObserver));
    this.subscribers.push(this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADITEMUOMS_DTO).
    subscribe(itemUomsObserver));
  }

  ngOnInit(): void {
    this.initItemsPaginatorSort();
    this.initLocationsPaginatorSort();
    this.initOrdersPaginatorSort();
    this.initLoadPicksPaginatorSort();
    this.initItemUomsPaginatorSort();
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }

  applyFilter(filterValue: string, type) {
    this[`${type}DtoDataSource`].filter = filterValue.trim().toLowerCase();

    if (this[`${type}DtoDataSource`].paginator) {
      this[`${type}DtoDataSource`].paginator.firstPage();
    }
  }

  initItemsPaginatorSort() {
    this.itemsDtoDataSource.paginator = this.itemsPaginator;
    this.itemsDtoDataSource.sort = this.itemsSort;
  }

  initLocationsPaginatorSort() {
    this.locationsDtoDataSource.paginator = this.locationsPaginator;
    this.locationsDtoDataSource.sort = this.locationsSort;
  }

  initOrdersPaginatorSort() {
    this.ordersDtoDataSource.paginator = this.ordersPaginator;
    this.ordersDtoDataSource.sort = this.ordersSort;
  }

  initLoadPicksPaginatorSort() {
    this.loadPicksDtoDataSource.paginator = this.loadPicksPaginator;
    this.loadPicksDtoDataSource.sort = this.loadPicksSort;
  }

  initItemUomsPaginatorSort() {
    this.itemUomsDtoDataSource.paginator = this.itemUomsPaginator;
    this.itemUomsDtoDataSource.sort = this.itemUomsSort;
  }

  renderColumnData(type: string, column: any) {
    return this.utilities.renderColumnData(type, column);
  }

  clearAllRecentOrigins() {
    const observer = {
      next: (response) => {
        if (response === true) {
          this.isLoadingResults = true;
          this.recentOriginsService.clearAll().subscribe(result => {
            this.isLoadingResults = false;
            this.itemsDtoDataSource.data = [];
            this.locationsDtoDataSource.data = [];
            this.ordersDtoDataSource.data = [];
            this.loadPicksDtoDataSource.data = [];
            this.itemUomsDtoDataSource.data = [];
            this.utilities.log(`all recent origins cleared`);
            this.utilities.showSnackBar(`All recent origins cleared`, 'OK');
          }, error => {
            this.utilities.error('Error on clearing all recent origins');
            this.utilities.showSnackBar(`Error trying to clear all recent origins`, 'OK');
          });
        }
      },
      error: (error) => {
        this.utilities.error('Error on clear all recent origins', error);
        this.utilities.showSnackBar('Error on clear all recent origins', 'OK');
      }
    } as Observer<any>;

    this.utilities.showCommonDialog(observer, {
      title: 'Clear Storage',
      message: 'Are you sure about clear all records? This action cannot be undone.'
    });
  }

  clearStorage(type: string) {
    if (this[`${type}DtoDataSource`] === undefined || this[`${type}DtoDataSource`] === null ||
        this[`${type}DtoDataSource`].data === undefined || this[`${type}DtoDataSource`].data === undefined
        || this[`${type}DtoDataSource`].data.length === 0) {
      return;
    }
    const observer = {
      next: (response) => {
        if (response === true) {
          this.isLoadingResults = true;
          this.recentOriginsService.clearStorage(type).subscribe(result => {
            this.isLoadingResults = false;
            this[`${type}DtoDataSource`].data = [];
            this.utilities.log(`${type} local storage cleared`);
            this.utilities.showSnackBar(`${type} local storage cleared`, 'OK');
          }, error => {
            this.utilities.error('Error on clearing local storage');
            this.utilities.showSnackBar(`Error trying to clear ${type} local storage`, 'OK');
          });
        }
      },
      error: (error) => {
        this.utilities.error('Error on clear storage', error);
        this.utilities.showSnackBar('Error on clear storage', 'OK');
      }
    } as Observer<any>;

    this.utilities.showCommonDialog(observer, {
      title: 'Clear Storage',
      message: 'Are you sure about clear all records? This action cannot be undone.'
    });
  }
}
