import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsComponent } from './items.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { ItemsResolverService } from './items-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: ItemsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.ITEMS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: ItemsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.ITEMS
        }
    },
    {
        path: '',
        component: ItemsComponent
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
export class ItemsRoutingModule {}
