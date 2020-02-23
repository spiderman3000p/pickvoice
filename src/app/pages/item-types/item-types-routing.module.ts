import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemTypesComponent } from './item-types.component';

const routes: Routes = [
    {
        path: '',
        component: ItemTypesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemTypesRoutingModule {}
