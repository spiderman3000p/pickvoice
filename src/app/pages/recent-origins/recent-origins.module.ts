import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecentOriginsRoutingModule } from './recent-origins-routing.module';
import { RecentOriginsComponent } from './recent-origins.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [RecentOriginsComponent],
  imports: [
    CommonModule,
    RecentOriginsRoutingModule,

    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule
  ]
})
export class RecentOriginsModule { }
