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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PagesModule } from './pages/pages.module';
import { AuthModule } from './pages/auth/auth.module';
import { ApiModule, Configuration, ConfigurationParameters } from '@pickvoice/pickvoice-api';
import { BASE_PATH } from '@pickvoice/pickvoice-api';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './http-interceptors/api-interceptor';

import { EditTaskLineComponent } from './pages/edit-task-line/edit-task-line.component';
import { EditPickTaskComponent } from './pages/edit-pick-task/edit-pick-task.component';
import { EditRowComponent } from './pages/edit-row/edit-row.component';
import { AddRowDialogComponent } from './components/add-row-dialog/add-row-dialog.component';
import { EditRowDialogComponent } from './components/edit-row-dialog/edit-row-dialog.component';
import { PrintComponent } from './components/print/print.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { ImportingWidgetComponent } from './components/importing-widget/importing-widget.component';
import { FileImportComponent } from './components/importing-widget/pages/file-import/file-import.component';
import { ImportTypeSelectionComponent } from './components/importing-widget/pages/import-type-selection/import-type-selection.component';

import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { OrderSelectorDialogComponent } from './components/order-selector-dialog/order-selector-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';
import { AddOrderLineDialogComponent } from './components/add-order-line-dialog/add-order-line-dialog.component';

import { NgSelectModule } from '@ng-select/ng-select';
// import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    accessToken: () => {
      let sessionToken = '';
      if (localStorage.getItem('access_token')) {
        sessionToken = localStorage.getItem('access_token');
      }
      // console.log('check session token: ', sessionToken);
      return sessionToken;
    }
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    ImportDialogComponent,
    ImportingWidgetComponent,
    ImportTypeSelectionComponent,
    FileImportComponent,
    CommonDialogComponent,
    EditRowComponent,
    EditPickTaskComponent,
    EditTaskLineComponent,
    AddRowDialogComponent,
    EditRowDialogComponent,
    PrintComponent,
    PrintLayoutComponent,
    AddOrderLineDialogComponent,
    OrderSelectorDialogComponent
  ],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    // NgOptionHighlightModule,
    /*FontAwesomeModule,*/

    MatSlideToggleModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressBarModule,
    NgSelectModule,

    PagesModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule,
    ContextMenuModule.forRoot({useBootstrap4: true})
  ],
  entryComponents: [
    ImportDialogComponent
  ],
  providers: [
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' }},
    { provide: BASE_PATH, useValue: environment.apiBaseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
