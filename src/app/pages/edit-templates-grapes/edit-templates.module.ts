import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTemplatesRoutingModule } from './edit-templates-routing.module';
import { EditTemplatesComponent } from './edit-templates.component';
import { OpenTemplateDialogComponent } from '../../components/open-template-dialog/open-template-dialog.component';
import { SaveTemplateDialogComponent } from '../../components/save-template-dialog/save-template-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [EditTemplatesComponent, OpenTemplateDialogComponent, SaveTemplateDialogComponent],
  imports: [
    CommonModule,
    EditTemplatesRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class EditTemplatesModule { }
