import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LpnRelocateComponent } from './lpn-relocate.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { LpnRelocateResolverService } from './lpn-relocate-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: LpnRelocateComponent,
        resolve: {
            data: LpnRelocateResolverService
        }
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
export class LpnRelocateRoutingModule {}
