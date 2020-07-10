import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpnRelocateRoutingModule } from './lpn-relocate-routing.module';
import { LpnRelocateComponent } from './lpn-relocate.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    LpnRelocateComponent
  ],
  imports: [
    CommonModule,
    LpnRelocateRoutingModule,

    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatListModule
  ],
  providers: [
  ]
})
export class LpnRelocateModule { }
