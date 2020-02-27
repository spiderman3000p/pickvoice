import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickingRoutingModule } from './picking-routing.module';
import { PickingComponent } from './picking.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [PickingComponent],
  imports: [
    CommonModule,
    PickingRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    
    MatGridListModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatMenuModule,
    MatSelectModule,
    AgGridModule.withComponents([])
  ]
})
export class PickingModule { }
