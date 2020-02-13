import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
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
import { LoginComponent } from './pages/auth/login/login.component';
import { PagesModule } from './pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from './components/importing-widget/importing-widget.component';
import { ApiModule } from '@pickvoice/pickvoice-api';
import { HttpClientModule } from '@angular/common/http';
import { EditRowDialogComponent } from './components/edit-row-dialog/edit-row-dialog.component';
import { FileImportComponent } from './components/importing-widget/pages/file-import/file-import.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { DataPreviewComponent } from './components/importing-widget/pages/data-preview/data-preview.component';
import { AgGridModule } from 'ag-grid-angular';
import { DataStorage } from './services/data-provider';
import { BASE_PATH } from '@pickvoice/pickvoice-api';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ImportDialogComponent,
    EditRowDialogComponent,
    ImportingWidgetComponent,
    FileImportComponent,
    DataPreviewComponent
  ],
  imports: [
    ApiModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
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
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    ImportDialogComponent
  ],
  providers: [
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' }},
    { provide: BASE_PATH, useValue: environment.apiBaseUrl },
    DataStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
