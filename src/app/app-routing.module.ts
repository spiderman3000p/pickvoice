import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { PagesComponent } from './pages/pages.component';
import { FileImportComponent } from './components/importing-widget/pages/file-import/file-import.component';
import { ImportTypeSelectionComponent } from './components/importing-widget/pages/import-type-selection/import-type-selection.component';
import { DataPreviewComponent } from './components/importing-widget/pages/data-preview/data-preview.component';
import { PrintComponent } from './components/print/print.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { ItemsResolverService } from './pages/items/items-resolver.service';
import { SectionsResolverService } from './pages/sections/sections-resolver.service';
import { LocationsResolverService } from './pages/locations/locations-resolver.service';
import { CustomerResolverService } from './pages/customer/customer-resolver.service';
import { OrdersResolverService } from './pages/orders/orders-resolver.service';
import { ItemTypesResolverService } from './pages/item-types/item-types-resolver.service';
import { OrderTypeResolverService } from './pages/order-type/order-type-resolver.service';
import { UomsResolverService } from './pages/uoms/uoms-resolver.service';
import { IMPORTING_TYPES } from './models/model-maps.model';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'login',
    // component: LoginComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivateChild: [AuthGuard]
  },
  { path: 'importing',
    outlet: 'importing',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'import-type-selection',
        component: ImportTypeSelectionComponent
        /*loadChildren: () => import('./components/importing-widget/pages/import-type-selection/import-type-selection.module')
        .then(m => m.ImportTypeSelectionModule)*/
      },
      {
        path: 'file-import',
        component: FileImportComponent
        /*loadChildren: () => import('./components/importing-widget/pages/file-import/file-import.module')
        .then(m => m.FileImportModule)*/
      },
      {
        path: 'data-preview',
        component: DataPreviewComponent
        /*loadChildren: () => import('./components/importing-widget/pages/data-preview/data-preview.module')
        .then(m => m.DataPreviewModule)*/
      },
      {
        path: '',
        redirectTo: 'import-type-selection',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'print',
    component: PrintLayoutComponent,
    // outlet: 'print',
    children: [
        {
          path: IMPORTING_TYPES.ITEMS + '/:id',
          component: PrintComponent,
          resolve: {
            row: ItemsResolverService,
          },
          data: {
            type: IMPORTING_TYPES.ITEMS,
            format: 'single',
            title: 'Print Item'
          }
        },
        {
          path: IMPORTING_TYPES.LOCATIONS + '/:id',
          component: PrintComponent,
          resolve: {
            row: LocationsResolverService,
          },
          data: {
            type: IMPORTING_TYPES.LOCATIONS,
            format: 'single',
            title: 'Print Location'
          }
        },
        {
          path: IMPORTING_TYPES.ORDERS + '/:id',
          component: PrintComponent,
          resolve: {
            row: OrdersResolverService,
          },
          data: {
            type: IMPORTING_TYPES.ORDERS,
            format: 'single',
            title: 'Print Order'
          }
        },
        {
          path: IMPORTING_TYPES.ITEM_TYPE + '/:id',
          component: PrintComponent,
          resolve: {
            row: ItemTypesResolverService,
          },
          data: {
            type: IMPORTING_TYPES.ITEM_TYPE,
            format: 'single',
            title: 'Print Item Type'
          }
        },
        {
          path: IMPORTING_TYPES.UOMS + '/:id',
          component: PrintComponent,
          resolve: {
            row: UomsResolverService,
          },
          data: {
            type: IMPORTING_TYPES.UOMS,
            format: 'single',
            title: 'Print Unity of Measure'
          }
        },
        {
          path: IMPORTING_TYPES.ORDER_TYPE + '/:id',
          component: PrintComponent,
          resolve: {
            row: OrderTypeResolverService,
          },
          data: {
            type: IMPORTING_TYPES.ORDER_TYPE,
            format: 'single',
            title: 'Print Order Type'
          }
        },
        {
          path: IMPORTING_TYPES.SECTIONS + '/:id',
          component: PrintComponent,
          resolve: {
            row: SectionsResolverService,
          },
          data: {
            type: IMPORTING_TYPES.SECTIONS,
            format: 'single',
            title: 'Print Section'
          }
        },
        {
          path: IMPORTING_TYPES.CUSTOMERS + '/:id',
          component: PrintComponent,
          resolve: {
            row: CustomerResolverService,
          },
          data: {
            type: IMPORTING_TYPES.CUSTOMERS,
            format: 'single',
            title: 'Print Customer'
          }
        },
        {
          path: IMPORTING_TYPES.ORDER_LINE + '/:id',
          component: PrintComponent,
          resolve: {
            row: CustomerResolverService, // TODO: implementar OrderLineResolver
          },
          data: {
            type: IMPORTING_TYPES.ORDER_LINE,
            format: 'single',
            title: 'Print Order Line'
          }
        }
    ]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
