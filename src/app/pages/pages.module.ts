import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';

import { AdministrationModule } from './administration/administration.module';
import { PendingOrdersModule } from './pending-orders/pending-orders.module';
import { CurrentActionsModule } from './current-actions/current-actions.module';
import { ItemsModule } from './items/items.module';
import { ItemTypesModule } from './item-types/item-types.module';
import { LocationsModule } from './locations/locations.module';
import { RecentOriginsModule } from './recent-origins/recent-origins.module';
import { ImportModule } from './import/import.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,

    PagesRoutingModule,
    AdministrationModule,
    PendingOrdersModule,
    CurrentActionsModule,
    ItemsModule,
    ItemTypesModule,
    LocationsModule,
    RecentOriginsModule,
    ImportModule,

    ReactiveFormsModule,
    FormsModule,

    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule
  ],
  providers: [
  ]
})
export class PagesModule { }
