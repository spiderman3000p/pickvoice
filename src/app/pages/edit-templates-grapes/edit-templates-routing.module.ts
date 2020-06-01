import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTemplatesComponent } from './edit-templates.component';

const routes: Routes = [
  {
    path: '',
    component: EditTemplatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTemplatesRoutingModule { }
