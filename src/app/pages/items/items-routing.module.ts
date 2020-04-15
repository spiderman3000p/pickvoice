import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsComponent } from './items.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { ItemsResolverService } from './items-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditItemComponent,
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
        component: EditItemComponent,
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
