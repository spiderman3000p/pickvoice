import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpnRelocateRoutingModule } from './lpn-relocate-routing.module';
import { LpnRelocateComponent } from './lpn-relocate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    LpnRelocateComponent
  ],
  imports: [
    CommonModule,
    LpnRelocateRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    DragDropModule
  ],
  providers: [
  ]
})
export class LpnRelocateModule { }
