import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpnsRoutingModule } from './lpns-routing.module';
import { LpnsComponent } from './lpns.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [
    LpnsComponent
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

    TreeModule.forRoot()
  ]
})
export class LpnsModule { }
