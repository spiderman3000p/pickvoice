import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickingComponent } from './picking.component';

const routes: Routes = [
    {
        path: '',
        component: PickingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PickingRoutingModule {}
