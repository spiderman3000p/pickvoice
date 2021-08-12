import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueryBuilderRoutingModule } from './query-builder-routing.module';
import { QueryBuilderComponent } from './query-builder.component';
// Importing QueryBuilderModule from ej2-angular-querybuilder package.
import { QueryBuilderModule as mQueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';

@NgModule({
  declarations: [QueryBuilderComponent],
  imports: [
    CommonModule,
    QueryBuilderRoutingModule,
    mQueryBuilderModule
  ]
})
export class QueryBuilderModule { }
