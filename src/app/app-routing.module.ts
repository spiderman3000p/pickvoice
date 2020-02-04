import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    // canActivateChild: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
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
