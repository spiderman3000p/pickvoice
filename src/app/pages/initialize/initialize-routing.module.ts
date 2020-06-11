import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitializeComponent } from './initialize.component';
import { InitializeResolverService } from './initialize-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        component: InitializeComponent,
        resolve: {
            data: InitializeResolverService,
        }
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class InitializeRoutingModule {}
