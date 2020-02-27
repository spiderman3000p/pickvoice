import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { PagesModule } from './pages/pages.module';
import { AuthModule } from './pages/auth/auth.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from './components/importing-widget/importing-widget.component';
import { ApiModule } from '@pickvoice/pickvoice-api';
import { HttpClientModule } from '@angular/common/http';
import { EditRowDialogComponent } from './components/edit-row-dialog/edit-row-dialog.component';
import { FileImportComponent } from './components/importing-widget/pages/file-import/file-import.component';
import { ImportTypeSelectionComponent } from './components/importing-widget/pages/import-type-selection/import-type-selection.component';
import { DataPreviewComponent } from './components/importing-widget/pages/data-preview/data-preview.component';

import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { AgGridModule } from 'ag-grid-angular';
import { BASE_PATH } from '@pickvoice/pickvoice-api';
import { environment } from '../environments/environment';
import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ImportDialogComponent,
    EditRowDialogComponent,
    ImportingWidgetComponent,
    ImportTypeSelectionComponent,
    DataPreviewComponent,
    FileImportComponent,
    CommonDialogComponent
  ],
  imports: [
    ApiModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,

    MatSlideToggleModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatRadioModule,
    MatTabsModule,
    MatFormFieldModule,
    MatTableModule,

    PagesModule,
    AuthModule,
    // DataPreviewModule,
    // FileImportModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    ImportDialogComponent
  ],
  providers: [
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' }},
    { provide: BASE_PATH, useValue: environment.apiBaseUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
