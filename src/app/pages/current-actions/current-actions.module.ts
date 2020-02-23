import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentActionsRoutingModule } from './current-actions-routing.module';
import { CurrentActionsComponent } from './current-actions.component';


@NgModule({
  declarations: [CurrentActionsComponent],
  imports: [
    CommonModule,
    CurrentActionsRoutingModule
  ]
})
export class CurrentActionsModule { }
