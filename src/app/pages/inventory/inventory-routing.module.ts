import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryComponent } from './inventory.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { InventoryItemResolverService } from './inventory-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: InventoryItemResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.INVENTORY
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: InventoryItemResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.INVENTORY
        }
    },
    {
        path: '',
        component: InventoryComponent
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
export class InventoryRoutingModule {}
