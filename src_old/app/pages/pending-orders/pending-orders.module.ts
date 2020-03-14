import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingOrdersRoutingModule } from './pending-orders-routing.module';
import { PendingOrdersComponent } from './pending-orders.component';


@NgModule({
  declarations: [PendingOrdersComponent],
  imports: [
    CommonModule,
    PendingOrdersRoutingModule
  ]
})
export class PendingOrdersModule { }
