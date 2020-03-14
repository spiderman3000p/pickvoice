import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemTypesComponent } from './item-types.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { ItemTypesResolverService } from './item-types-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: ItemTypesResolverService,
        },
        data: {
            viewMode: 'edit'
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: ItemTypesResolverService,
        },
        data: {
            viewMode: 'view'
        }
    },
    {
        path: '',
        component: ItemTypesComponent
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
export class ItemTypesRoutingModule {}
