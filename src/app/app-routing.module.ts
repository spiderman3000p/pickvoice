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
import { QualityStatesResolverService } from './pages/quality-states/quality-states-resolver.service';
import { SectionsResolverService } from './pages/sections/sections-resolver.service';
import { LocationsResolverService } from './pages/locations/locations-resolver.service';
import { CustomerResolverService } from './pages/customer/customer-resolver.service';
import { OrdersResolverService } from './pages/orders/orders-resolver.service';
import { DocksResolverService } from './pages/docks/docks-resolver.service';
import { ItemTypesResolverService } from './pages/item-types/item-types-resolver.service';
import { OrderTypeResolverService } from './pages/order-type/order-type-resolver.service';
import { UomsResolverService } from './pages/uoms/uoms-resolver.service';
import { TransportResolverService } from './pages/transports/transport-resolver.service';
import { PickingPlanningResolverService } from './pages/picking-planning/picking-planning-resolver.service';
import { PickTaskResolverService } from './pages/picking-planning/pick-task-resolver.service';
import { PickTaskLineResolverService } from './pages/picking-planning/pick-task-line-resolver.service';
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
  {
    path: 'importing',
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
        },
        {
          path: IMPORTING_TYPES.TRANSPORTS + '/:id',
          component: PrintComponent,
          resolve: {
            row: TransportResolverService,
          },
          data: {
            type: IMPORTING_TYPES.TRANSPORTS,
            format: 'single',
            title: 'Print Transport'
          }
        },
        {
          path: IMPORTING_TYPES.PICK_PLANNINGS + '/:id',
          component: PrintComponent,
          resolve: {
            row: PickingPlanningResolverService,
          },
          data: {
            type: IMPORTING_TYPES.PICK_PLANNINGS,
            format: 'single',
            title: 'Print Pick Planning'
          }
        },
        {
          path: IMPORTING_TYPES.PICK_TASKS + '/:id',
          component: PrintComponent,
          resolve: {
            row: PickTaskResolverService,
          },
          data: {
            type: IMPORTING_TYPES.PICK_TASKS,
            format: 'single',
            title: 'Print Task'
          }
        },
        {
          path: IMPORTING_TYPES.PICK_TASKLINES + '/:id',
          component: PrintComponent,
          resolve: {
            row: PickTaskLineResolverService,
          },
          data: {
            type: IMPORTING_TYPES.PICK_TASKLINES,
            format: 'single',
            title: 'Print Pick Task Line'
          }
        },
        {
          path: IMPORTING_TYPES.DOCKS + '/:id',
          component: PrintComponent,
          resolve: {
            row: DocksResolverService,
          },
          data: {
            type: IMPORTING_TYPES.DOCKS,
            format: 'single',
            title: 'Print Dock'
          }
        },
        {
          path: IMPORTING_TYPES.QUALITY_STATES + '/:id',
          component: PrintComponent,
          resolve: {
            row: QualityStatesResolverService,
          },
          data: {
            type: IMPORTING_TYPES.QUALITY_STATES,
            format: 'single',
            title: 'Print Quality State'
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
