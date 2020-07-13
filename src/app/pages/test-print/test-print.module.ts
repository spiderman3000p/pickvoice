import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestPrintRoutingModule } from './test-print-routing.module';
import { TestPrintComponent } from './test-print.component';

@NgModule({
  declarations: [TestPrintComponent],
  imports: [
    CommonModule,
    TestPrintRoutingModule
  ],
  providers: [
  ]
})
export class TestPrintModule { }
