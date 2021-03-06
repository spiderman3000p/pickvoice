import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IMPORTING_TYPES } from '../models/model-maps.model';

const routes: Routes = [
  {
    path: 'import',
    loadChildren: () => import('./import/import.module').then(m => m.ImportModule)
  },
  {
    path: 'recent-origins',
    loadChildren: () => import('./recent-origins/recent-origins.module').then(m => m.RecentOriginsModule)
  },
  {
    path: IMPORTING_TYPES.LPN,
    loadChildren: () => import('./lpns/lpns.module').then(m => m.LpnsModule)
  },
  {
    path: 'lpn-relocate',
    loadChildren: () => import('./lpn-relocate/lpn-relocate.module').then(m => m.LpnRelocateModule)
  },
  {
    path: 'lpn-transfer',
    loadChildren: () => import('./lpn-transfer/lpn-transfer.module').then(m => m.LpnTransferModule)
  },
  {
    path: IMPORTING_TYPES.INVENTORY,
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)
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
    path: IMPORTING_TYPES.QUALITY_STATES,
    loadChildren: () => import('./quality-states/quality-states.module').then(m => m.QualityStatesModule)
  },
  {
    path: IMPORTING_TYPES.LPN_INTERVAL,
    loadChildren: () => import('./lpn-intervals/lpn-interval.module').then(m => m.LpnIntervalModule)
  },
  {
    path: IMPORTING_TYPES.CUSTOMERS,
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: IMPORTING_TYPES.ORDER_TYPE,
    loadChildren: () => import('./order-type/order-type.module').then(m => m.OrderTypeModule)
  },
  {
    path: IMPORTING_TYPES.SECTIONS,
    loadChildren: () => import('./sections/sections.module').then(m => m.SectionsModule)
  },
  {
    path: IMPORTING_TYPES.TRANSPORTS,
    loadChildren: () => import('./transports/transport.module').then(m => m.TransportModule)
  },
  {
    path: IMPORTING_TYPES.PICK_PLANNINGS,
    loadChildren: () => import('./picking-planning/picking-planning.module').then(m => m.PickingPlanningModule)
  },
  {
    path: IMPORTING_TYPES.PICK_TASKS,
    loadChildren: () => import('./picking-task/picking-task.module').then(m => m.PickingTaskModule)
  },
  {
    path: IMPORTING_TYPES.TASK_TYPES,
    loadChildren: () => import('./task-type/task-type.module').then(m => m.TaskTypeModule)
  },
  {
    path: IMPORTING_TYPES.DOCKS,
    loadChildren: () => import('./docks/docks.module').then(m => m.DocksModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: 'current-actions',
    loadChildren: () => import('./current-actions/current-actions.module').then(m => m.CurrentActionsModule)
  },
  {
    path: IMPORTING_TYPES.PLANTS,
    loadChildren: () => import('./plants/plants.module').then(m => m.PlantsModule)
  },
  {
    path: IMPORTING_TYPES.DEPOTS,
    loadChildren: () => import('./depots/depots.module').then(m => m.DepotsModule)
  },
  {
    path: IMPORTING_TYPES.OWNERS,
    loadChildren: () => import('./owners/owners.module').then(m => m.OwnersModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'query-builder', loadChildren: () => import('./query-builder/query-builder.module').then(m => m.QueryBuilderModule) },
  { path: 'pages/filters', loadChildren: () => import('./filters/filters.module').then(m => m.FiltersModule) },
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
