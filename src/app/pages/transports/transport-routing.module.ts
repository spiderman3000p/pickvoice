import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportComponent } from './transport.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { TransportResolverService } from './transport-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
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
        component: EditRowComponent,
        resolve: {
            row: TransportResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.TRANSPORTS
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
