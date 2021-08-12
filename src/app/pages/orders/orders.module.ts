import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { AddOrderComponent } from '../add-order/add-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { NumericEditorComponent } from '../edit-order/numeric-editor.component';
import { DateEditorComponent } from '../edit-order/date-editor.component';
import { RowOptionComponent } from '../edit-order/row-option.component';
import { SelectCellComponent } from '../edit-order/select-cell.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { AgGridModule } from 'ag-grid-angular';
import { AddOrderLineComponent } from '../add-order-line/add-order-line.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { SelectCell2Component } from '../edit-order/select-cell2.component';
import { SearchCustomerDialogComponent } from 'src/app/components/customer-selector-dialog/customer-selector-dialog.component';
import { MatSliderModule } from '@angular/material';
import { ItemSelectorDialogComponent } from 'src/app/components/item-selector-dialog/item-selector-dialog.component';

@NgModule({
  declarations: [
    OrdersComponent, AddOrderComponent, EditOrderComponent, AddOrderLineComponent,
    NumericEditorComponent, DateEditorComponent, RowOptionComponent, SelectCellComponent, SelectCell2Component,
    SearchCustomerDialogComponent, ItemSelectorDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

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
    MatSliderModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    AgGridModule.withComponents([])
  ],
  providers: [
  ]
})
export class OrdersModule { }
