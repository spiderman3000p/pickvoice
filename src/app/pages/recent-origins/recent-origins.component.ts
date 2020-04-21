import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-recent-origins',
  templateUrl: './recent-origins.component.html',
  styleUrls: ['./recent-origins.component.css']
})
export class RecentOriginsComponent implements OnInit, OnDestroy {
  itemsDataSource: MatTableDataSource<RecentOrigin>;
  locationsDataSource: MatTableDataSource<RecentOrigin>;
  ordersDataSource: MatTableDataSource<RecentOrigin>;
  loadPicksDataSource: MatTableDataSource<RecentOrigin>;
  displayedColumns = Object.keys(ModelMap.RecentOriginMap);
  headers: any = ModelMap.RecentOriginMap;
  filter: FormControl;
  isLoadingResults = false;
  itemsRecentOrigins: RecentOrigin[];
  locationsRecentOrigins: RecentOrigin[];
  ordersRecentOrigins: RecentOrigin[];
  itemsSubscriber: Subscription;
  locationsSubscriber: Subscription;
  ordersSubscriber: Subscription;
  loadPicksSubscriber: Subscription;
  importingTypes = IMPORTING_TYPES;
  @ViewChild(MatPaginator, {static: true}) itemsPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) locationsPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) ordersPaginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) loadPicksPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) itemsSort: MatSort;
  @ViewChild(MatSort, {static: true}) locationsSort: MatSort;
  @ViewChild(MatSort, {static: true}) ordersSort: MatSort;
  @ViewChild(MatSort, {static: true}) loadPicksSort: MatSort;
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
  constructor(private recentOriginsService: RecentOriginsService, private utilities: UtilitiesService) {
    this.itemsDataSource = new MatTableDataSource([]);
    this.locationsDataSource = new MatTableDataSource([]);
    this.ordersDataSource = new MatTableDataSource([]);
    this.loadPicksDataSource = new MatTableDataSource([]);

    const itemsObserver = {
      next: (origins) => {
        this.utilities.log('items results type ', typeof origins);
        this.utilities.log('items recent origins', origins);
        this.itemsDataSource.data = origins;
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
        this.locationsDataSource.data = origins;
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
        this.ordersDataSource.data = origins;
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
        this.loadPicksDataSource.data = origins;
      },
      error: (error) => {
        this.utilities.error('error requesting load picks recent origins: ', error);
        this.utilities.showSnackBar('Error requesting load picks recent origins', 'OK');
      }
    };

    this.itemsSubscriber = this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADITEMS_DTO).
    subscribe(itemsObserver);
    this.locationsSubscriber = this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADLOCATIONS_DTO).
    subscribe(locationsObserver);
    this.ordersSubscriber = this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADORDERS_DTO).
    subscribe(ordersObserver);
    this.loadPicksSubscriber = this.recentOriginsService.getRecentOrigins(IMPORTING_TYPES.LOADPICKS_DTO).
    subscribe(loadPicksObserver);
  }

  ngOnInit(): void {
    this.initItemsPaginatorSort();
    this.initLocationsPaginatorSort();
    this.initOrdersPaginatorSort();
    this.initLoadPicksPaginatorSort();
  }

  ngOnDestroy(): void {
    this.itemsSubscriber.unsubscribe();
    this.locationsSubscriber.unsubscribe();
    this.ordersSubscriber.unsubscribe();
    this.loadPicksSubscriber.unsubscribe();
  }

  applyFilter(filterValue: string, type) {
    this[`${type}DataSource`].filter = filterValue.trim().toLowerCase();

    if (this[`${type}DataSource`].paginator) {
      this[`${type}DataSource`].paginator.firstPage();
    }
  }

  initItemsPaginatorSort() {
    this.itemsDataSource.paginator = this.itemsPaginator;
    this.itemsDataSource.sort = this.itemsSort;
  }

  initLocationsPaginatorSort() {
    this.locationsDataSource.paginator = this.locationsPaginator;
    this.locationsDataSource.sort = this.locationsSort;
  }

  initOrdersPaginatorSort() {
    this.ordersDataSource.paginator = this.ordersPaginator;
    this.ordersDataSource.sort = this.ordersSort;
  }

  initLoadPicksPaginatorSort() {
    this.loadPicksDataSource.paginator = this.loadPicksPaginator;
    this.loadPicksDataSource.sort = this.loadPicksSort;
  }

  renderColumnData(type: string, column: any) {
    return this.utilities.renderColumnData(type, column);
  }

  clearStorage(type: string) {
    if (this[`${type}DataSource`].data.length === 0) {
      return;
    }
    const observer = {
      next: (response) => {
        if (response === true) {
          this.isLoadingResults = true;
          this.recentOriginsService.clearStorage(type).subscribe(result => {
            this.isLoadingResults = false;
            this[`${type}DataSource`].data = [];
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
