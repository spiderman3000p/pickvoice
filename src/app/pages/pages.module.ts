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

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

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

    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule
  ],
  providers: [
  ]
})
export class PagesModule { }
