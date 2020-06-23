import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantsComponent } from './plants.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { PlantsResolverService } from './plants-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: PlantsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.PLANTS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: PlantsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.PLANTS
        }
    },
    {
        path: '',
        component: PlantsComponent
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
export class PlantsRoutingModule {}
