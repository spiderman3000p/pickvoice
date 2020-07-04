import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { RowOptionComponent } from '../edit-customer/row-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    CustomerComponent, EditCustomerComponent, RowOptionComponent, AddCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    AgGridModule.withComponents([])
  ],
  providers: [
  ]
})
export class CustomerModule { }
