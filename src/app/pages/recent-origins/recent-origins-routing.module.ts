import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentOriginsComponent } from './recent-origins.component';

const routes: Routes = [
    {
        path: '',
        component: RecentOriginsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecentOriginsRoutingModule {}
