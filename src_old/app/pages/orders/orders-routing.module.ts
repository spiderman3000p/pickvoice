import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { OrdersResolverService } from './orders-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: OrdersResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.ORDERS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: OrdersResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.ORDERS
        }
    },
    {
        path: '',
        component: OrdersComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule {}
