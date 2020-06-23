import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnersComponent } from './owners.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { OwnersResolverService } from './owners-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: OwnersResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.OWNERS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: OwnersResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.OWNERS
        }
    },
    {
        path: '',
        component: OwnersComponent
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
export class OwnersRoutingModule {}
