import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocksComponent } from './docks.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AddDockComponent } from '../add-dock/add-dock.component';
import { AddDockResolverService } from '../add-dock/add-dock-resolver.service';
import { EditDockComponent } from '../edit-dock/edit-dock.component';
import { EditDockResolverService } from '../edit-dock/edit-dock-resolver.service';

const routes: Routes = [
    {
        path: 'add',
        component: AddDockComponent,
        resolve: {
            data: AddDockResolverService
        }
    },
    {
        path: 'edit/:id',
        component: EditDockComponent,
        resolve: {
            data: EditDockResolverService
        },
        data: {
            viewMode: 'edit'
        }
    },
    {
        path: 'view/:id',
        component: EditDockComponent,
        resolve: {
            data: EditDockResolverService,
        },
        data: {
            viewMode: 'view'
        }
    },
    {
        path: '',
        component: DocksComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
    ]
})
export class DocksRoutingModule {}
