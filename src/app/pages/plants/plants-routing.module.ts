import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantsComponent } from './plants.component';
import { EditPlantComponent } from '../edit-plant/edit-plant.component';
import { AddPlantComponent } from '../add-plant/add-plant.component';
import { AddPlantResolverService } from '../add-plant/add-plant-resolver.service';
import { PlantsResolverService } from './plants-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditPlantComponent,
        resolve: {
            row: PlantsResolverService,
        },
        data: {
            viewMode: 'edit'
        }
    },
    {
        path: 'view/:id',
        component: EditPlantComponent,
        resolve: {
            row: PlantsResolverService,
        },
        data: {
            viewMode: 'view'
        }
    },
    {
        path: 'add',
        component: AddPlantComponent,
        resolve: {
            data: AddPlantResolverService,
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
