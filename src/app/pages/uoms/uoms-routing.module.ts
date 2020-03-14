import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UomsComponent } from './uoms.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { UomsResolverService } from './uoms-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: UomsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.UOMS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: UomsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.UOMS
        }
    },
    {
        path: '',
        component: UomsComponent
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
export class UomsRoutingModule {}
