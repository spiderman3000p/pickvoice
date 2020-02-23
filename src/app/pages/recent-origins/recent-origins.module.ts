import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecentOriginsRoutingModule } from './recent-origins-routing.module';
import { RecentOriginsComponent } from './recent-origins.component';

import { MatFormFieldModule } from '@angular/material/form-field';
/*import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';*/
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
/*import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';*/
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatExpansionModule } from '@angular/material/expansion';
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
    /*MatDatepickerModule,
    MatNativeDateModule,*/
    MatButtonModule,
    /*MatToolbarModule,
    MatSidenavModule,*/
    MatIconModule,
    /*MatListModule,
    MatGridListModule,*/
    MatCardModule,
    /*MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,*/
    MatTabsModule
  ]
})
export class RecentOriginsModule { }
