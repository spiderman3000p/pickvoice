import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportComponent } from './transport.component';
import { EditTransportComponent } from '../edit-transport/edit-transport.component';
import { AddTransportComponent } from '../add-transport/add-transport.component';
import { AddTransportResolverService } from '../add-transport/add-transport-resolver.service';
import { TransportResolverService } from './transport-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditTransportComponent,
        resolve: {
            row: TransportResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.TRANSPORTS
        }
    },
    {
        path: 'view/:id',
        component: EditTransportComponent,
        resolve: {
            row: TransportResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.TRANSPORTS
        }
    },
    {
        path: 'add',
        component: AddTransportComponent,
        resolve: {
            data: AddTransportResolverService,
        }
    },
    {
        path: '',
        component: TransportComponent
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
export class TransportRoutingModule {}
