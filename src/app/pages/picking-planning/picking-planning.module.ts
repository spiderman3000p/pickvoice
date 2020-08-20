import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickingPlanningRoutingModule } from './picking-planning-routing.module';
import { PickingPlanningComponent } from './picking-planning.component';
import { EditPickPlanningComponent } from '../edit-pick-planning/edit-pick-planning.component';
import { AddPickPlanningComponent } from '../add-pick-planning/add-pick-planning.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ContextMenuModule } from 'ngx-contextmenu';
import { UserSelectorDialogComponent } from 'src/app/components/user-selector-dialog/user-selector-dialog.component';

@NgModule({
  declarations: [PickingPlanningComponent, EditPickPlanningComponent, AddPickPlanningComponent, UserSelectorDialogComponent],
  imports: [
    CommonModule,
    PickingPlanningRoutingModule,

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
    MatProgressBarModule,
    ContextMenuModule
  ],
  providers: [
  ]
})
export class PickingPlanningModule { }
