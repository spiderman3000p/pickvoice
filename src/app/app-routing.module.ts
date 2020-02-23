import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { PagesComponent } from './pages/pages.component';
import { FileImportComponent } from './components/importing-widget/pages/file-import/file-import.component';
import { ImportTypeSelectionComponent } from './components/importing-widget/pages/import-type-selection/import-type-selection.component';
import { DataPreviewComponent } from './components/importing-widget/pages/data-preview/data-preview.component';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'login',
    // component: LoginComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivateChild: [AuthGuard]
  },
  { path: 'importing',
    outlet: 'importing',
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: 'import-type-selection',
        component: ImportTypeSelectionComponent
        /*loadChildren: () => import('./components/importing-widget/pages/import-type-selection/import-type-selection.module')
        .then(m => m.ImportTypeSelectionModule)*/
      },
      {
        path: 'file-import',
        component: FileImportComponent
        /*loadChildren: () => import('./components/importing-widget/pages/file-import/file-import.module')
        .then(m => m.FileImportModule)*/
      },
      {
        path: 'data-preview',
        component: DataPreviewComponent
        /*loadChildren: () => import('./components/importing-widget/pages/data-preview/data-preview.module')
        .then(m => m.DataPreviewModule)*/
      },
      {
        path: '',
        redirectTo: 'import-type-selection',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
