import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpnTransferRoutingModule } from './lpn-transfer-routing.module';
import { LpnTransferComponent } from './lpn-transfer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    LpnTransferComponent
  ],
  imports: [
    CommonModule,
    LpnTransferRoutingModule,

    FormsModule,
    ReactiveFormsModule,
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
export class LpnTransferModule { }
