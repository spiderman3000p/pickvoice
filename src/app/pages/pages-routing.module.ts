import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ImportComponent } from '../pages/import/import.component';
import { RecentOriginsComponent } from '../pages/recent-origins/recent-origins.component';
import { ItemsComponent } from '../pages/items/items.component';
import { LocationsComponent } from '../pages/locations/locations.component';
import { ItemTypesComponent } from '../pages/item-types/item-types.component';
import { CurrentActionsComponent } from '../pages/current-actions/current-actions.component';
import { AdministrationComponent } from '../pages/administration/administration.component';
import { PendingOrdersComponent } from '../pages/pending-orders/pending-orders.component';

const routes: Routes = [
  {
    path: 'import',
    component: ImportComponent,
    pathMatch: 'full'
  },
  {
    path: 'recent-origins',
    component: RecentOriginsComponent,
    pathMatch: 'full'
  },
  {
    path: 'items',
    component: ItemsComponent,
    pathMatch: 'full'
  },
  {
    path: 'locations',
    component: LocationsComponent,
    pathMatch: 'full'
  },
  {
    path: 'item-types',
    component: ItemTypesComponent,
    pathMatch: 'full'
  },
  {
    path: 'administration',
    component: AdministrationComponent,
    pathMatch: 'full'
  },
  {
    path: 'pending-orders',
    component: PendingOrdersComponent,
    pathMatch: 'full'
  },
  {
    path: 'current-actions',
    component: CurrentActionsComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
