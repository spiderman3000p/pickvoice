import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepotsComponent } from './depots.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { DepotsResolverService } from './depots-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: DepotsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.DEPOTS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: DepotsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.DEPOTS
        }
    },
    {
        path: '',
        component: DepotsComponent
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
export class DepotsRoutingModule {}
