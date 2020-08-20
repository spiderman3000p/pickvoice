import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PagesComponent } from './pages.component';
import { ChangeUserDataComponent } from '../components/change-user-data/change-user-data.component';

@NgModule({
  declarations: [
    PagesComponent,
    ChangeUserDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PagesRoutingModule,

    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  providers: [
  ]
})
export class PagesModule { }
