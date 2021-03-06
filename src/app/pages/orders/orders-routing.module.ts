import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { AddOrderComponent } from '../add-order/add-order.component';
import { AddOrderResolverService } from '../add-order/add-order-resolver.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { OrdersResolverService } from './orders-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditOrderComponent,
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
        component: EditOrderComponent,
        resolve: {
            row: OrdersResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.ORDERS
        }
    },
    {
        path: 'add',
        component: AddOrderComponent,
        resolve: {
            data: AddOrderResolverService
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
