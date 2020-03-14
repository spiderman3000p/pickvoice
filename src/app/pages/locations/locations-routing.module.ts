import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsComponent } from './locations.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { LocationsResolverService } from './locations-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: LocationsResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.LOCATIONS
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: LocationsResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.LOCATIONS
        }
    },
    {
        path: '',
        component: LocationsComponent
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
export class LocationsRoutingModule {}
