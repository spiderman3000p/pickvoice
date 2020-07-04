import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { NumericEditorComponent } from '../edit-item/numeric-editor.component';
import { RowOptionComponent } from '../edit-item/row-option.component';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    ItemsComponent, EditItemComponent, AddItemComponent, NumericEditorComponent, RowOptionComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,

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
    MatMenuModule,
    MatSlideToggleModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    AgGridModule.withComponents([])
  ],
  providers: [
  ]
})
export class ItemsModule { }
