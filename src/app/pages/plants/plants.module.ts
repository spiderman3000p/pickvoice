import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantsRoutingModule } from './plants-routing.module';
import { PlantsComponent } from './plants.component';
import { AddPlantComponent } from '../add-plant/add-plant.component';
import { EditPlantComponent } from '../edit-plant/edit-plant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

import { AgGridModule } from 'ag-grid-angular';
import { NumericEditorComponent } from '../edit-plant/numeric-editor.component';
import { RowOptionComponent } from '../edit-plant/row-option.component';

@NgModule({
  declarations: [
    PlantsComponent, AddPlantComponent, EditPlantComponent, NumericEditorComponent, RowOptionComponent
  ],
  imports: [
    CommonModule,
    PlantsRoutingModule,

    FormsModule,
    ReactiveFormsModule,

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
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
  ]
})
export class PlantsModule { }
