import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemTypesRoutingModule } from './item-types-routing.module';
import { ItemTypesComponent } from './item-types.component';


@NgModule({
  declarations: [ItemTypesComponent],
  imports: [
    CommonModule,
    ItemTypesRoutingModule
  ]
})
export class ItemTypesModule { }
