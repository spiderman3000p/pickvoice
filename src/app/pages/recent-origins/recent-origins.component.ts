import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { RecentOriginsService } from '../../services/recent-origins.service';
import { ModelMap } from '../../models/model-maps.model';
import { RecentOrigin } from '../../models/recent-origin.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-recent-origins',
  templateUrl: './recent-origins.component.html',
  styleUrls: ['./recent-origins.component.css']
})
export class RecentOriginsComponent implements OnInit {
  itemsDataSource: MatTableDataSource<RecentOrigin>;
  locationsDataSource: MatTableDataSource<RecentOrigin>;
  ordersDataSource: MatTableDataSource<RecentOrigin>;
  displayedColumns = Object.keys(ModelMap.RecentOriginMap);
  headers: any = ModelMap.RecentOriginMap;
  filter: FormControl;
  isLoadingResults = false;
  itemsRecentOrigins: RecentOrigin[];
  locationsRecentOrigins: RecentOrigin[];
  ordersRecentOrigins: RecentOrigin[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private recentOriginsService: RecentOriginsService, private utilities: UtilitiesService) {
    this.itemsDataSource = new MatTableDataSource([]);
    this.locationsDataSource = new MatTableDataSource([]);
    this.ordersDataSource = new MatTableDataSource([]);

    this.recentOriginsService.itemsRecentOrigins.subscribe(origins => {
      console.log('items recent origins', origins);
      this.itemsDataSource.data = origins;
    }, error => {
      console.error('error requesting items recent origins: ', error);
    }, () => {
      console.log('items recent origins completed');
    });

    this.recentOriginsService.locationsRecentOrigins.subscribe(origins => {
      console.log('locations recent origins', origins);
      this.locationsDataSource.data = origins;
    }, error => {
      console.error('error requesting locations recent origins: ', error);
    }, () => {
      console.log('locations recent origins completed');
    });

    this.recentOriginsService.ordersRecentOrigins.subscribe(origins => {
      console.log('orders recent origins', origins);
      this.ordersDataSource.data = origins;
    }, error => {
      console.error('error requesting orders recent origins: ', error);
    }, () => {
      console.log('orders recent origins completed');
    });
    this.recentOriginsService.getRecentOrigins('items');
    this.recentOriginsService.getRecentOrigins('locations');
    this.recentOriginsService.getRecentOrigins('orders');
  }

  ngOnInit(): void {
  }

  renderColumnData(type: string, column: any) {
    return this.utilities.renderColumnData(type, column);
  }

  clearStorage(type: string) {
    this.isLoadingResults = true;
    this.recentOriginsService.clearStorage(type).subscribe(result => {
      this.isLoadingResults = false;
      console.log(`${type} local storage cleared`);
      this.utilities.showSnackBar(`${type} local storage cleared`, 'OK');
    }, error => {
      console.error('Error on clearing local storage');
      this.utilities.showSnackBar(`Error trying to clear ${type} local storage`, 'OK');
    });
  }
}
