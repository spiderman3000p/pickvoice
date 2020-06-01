import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTemplatesRoutingModule } from './edit-templates-routing.module';
import { EditTemplatesComponent } from './edit-templates.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [EditTemplatesComponent],
  imports: [
    CommonModule,
    EditTemplatesRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatListModule
  ]
})
export class EditTemplatesModule { }
