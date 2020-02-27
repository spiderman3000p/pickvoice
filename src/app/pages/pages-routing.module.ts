import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'picking',
    // component: ImportComponent,
    loadChildren: () => import('./picking/picking.module').then(m => m.PickingModule),
    pathMatch: 'full'
  },
  {
    path: 'import',
    // component: ImportComponent,
    loadChildren: () => import('./import/import.module').then(m => m.ImportModule),
    pathMatch: 'full'
  },
  {
    path: 'recent-origins',
    // component: RecentOriginsComponent,
    loadChildren: () => import('./recent-origins/recent-origins.module').then(m => m.RecentOriginsModule),
    pathMatch: 'full'
  },
  {
    path: 'items',
    // component: ItemsComponent,
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule),
    pathMatch: 'full'
  },
  {
    path: 'locations',
    // component: LocationsComponent,
    loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule),
    pathMatch: 'full'
  },
  {
    path: 'item-types',
    // component: ItemTypesComponent,
    loadChildren: () => import('./item-types/item-types.module').then(m => m.ItemTypesModule),
    pathMatch: 'full'
  },
  {
    path: 'administration',
    // component: AdministrationComponent,
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule),
    pathMatch: 'full'
  },
  {
    path: 'pending-orders',
    // component: PendingOrdersComponent,
    loadChildren: () => import('./pending-orders/pending-orders.module').then(m => m.PendingOrdersModule),
    pathMatch: 'full'
  },
  {
    path: 'current-actions',
    // component: CurrentActionsComponent,
    loadChildren: () => import('./current-actions/current-actions.module').then(m => m.CurrentActionsModule),
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    // component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
