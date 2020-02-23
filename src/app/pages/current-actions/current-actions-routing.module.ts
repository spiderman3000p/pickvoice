import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentActionsComponent } from './current-actions.component';

const routes: Routes = [
    {
        path: '',
        component: CurrentActionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CurrentActionsRoutingModule {}
