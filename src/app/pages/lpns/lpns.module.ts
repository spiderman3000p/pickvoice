import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpnsRoutingModule } from './lpns-routing.module';
import { LpnsComponent } from './lpns.component';
import { PrintLabelDialogComponent } from '../../components/print-label-dialog/print-label-dialog.component';
import { GenerateLpnIntervalDialogComponent } from '../../components/generate-lpn-interval-dialog/generate-lpn-interval-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TreeModule } from 'angular-tree-component';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  declarations: [
    LpnsComponent, PrintLabelDialogComponent, GenerateLpnIntervalDialogComponent
  ],
  imports: [
    CommonModule,
    LpnsRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,

    TreeModule.forRoot(),
    ContextMenuModule
  ]
})
export class LpnsModule { }
