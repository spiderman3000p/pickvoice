import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestPrintComponent } from './test-print.component';

const routes: Routes = [
    {
        path: '',
        component: TestPrintComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestPrintRoutingModule {}
