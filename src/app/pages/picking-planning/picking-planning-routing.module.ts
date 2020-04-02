import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickingPlanningComponent } from './picking-planning.component';

const routes: Routes = [
    {
        path: '',
        component: PickingPlanningComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PickingPlanningRoutingModule {}
