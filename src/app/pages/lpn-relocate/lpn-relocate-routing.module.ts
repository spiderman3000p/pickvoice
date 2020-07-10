import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LpnRelocateComponent } from './lpn-relocate.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        component: LpnRelocateComponent
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
