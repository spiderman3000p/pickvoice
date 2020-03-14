import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IMPORTING_TYPES } from '../models/model-maps.model';

const routes: Routes = [
  {
    path: 'picking',
    loadChildren: () => import('./picking/picking.module').then(m => m.PickingModule),
    pathMatch: 'full'
  },
  {
    path: 'import',
    loadChildren: () => import('./import/import.module').then(m => m.ImportModule),
    pathMatch: 'full'
  },
  {
    path: 'recent-origins',
    loadChildren: () => import('./recent-origins/recent-origins.module').then(m => m.RecentOriginsModule),
    pathMatch: 'full'
  },
  {
    path: IMPORTING_TYPES.ITEMS,
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  },
  {
    path: IMPORTING_TYPES.LOCATIONS,
    loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule)
  },
  {
    path: IMPORTING_TYPES.ORDERS,
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: IMPORTING_TYPES.ITEM_TYPE,
    loadChildren: () => import('./item-types/item-types.module').then(m => m.ItemTypesModule)
  },
  {
    path: IMPORTING_TYPES.UOMS,
    loadChildren: () => import('./uoms/uoms.module').then(m => m.UomsModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule),
    pathMatch: 'full'
  },
  {
    path: 'pending-orders',
    loadChildren: () => import('./pending-orders/pending-orders.module').then(m => m.PendingOrdersModule),
    pathMatch: 'full'
  },
  {
    path: 'current-actions',
    loadChildren: () => import('./current-actions/current-actions.module').then(m => m.CurrentActionsModule),
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    pathMatch: 'full'
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule),
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