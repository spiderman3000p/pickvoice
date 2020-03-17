import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { CustomerResolverService } from './customer-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: CustomerResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.CUSTOMERS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: CustomerResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.CUSTOMERS
        }
    },
    {
        path: '',
        component: CustomerComponent
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
export class CustomerRoutingModule {}
