import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectionsComponent } from './sections.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { SectionsResolverService } from './sections-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: SectionsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.SECTIONS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: SectionsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.SECTIONS
        }
    },
    {
        path: '',
        component: SectionsComponent
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
export class SectionsRoutingModule {}
