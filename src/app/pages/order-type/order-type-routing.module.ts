import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderTypeComponent } from './order-type.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { OrderTypeResolverService } from './order-type-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: OrderTypeResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.ORDER_TYPE
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: OrderTypeResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.ORDER_TYPE
        }
    },
    {
        path: '',
        component: OrderTypeComponent
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
export class OrderTypeRoutingModule {}
