import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsComponent } from './locations.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { AddLocationComponent } from '../add-location/add-location.component';
import { AddLocationResolverService } from '../add-location/add-location-resolver.service';
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
        path: 'add',
        component: AddLocationComponent,
        resolve: {
            data: AddLocationResolverService,
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
