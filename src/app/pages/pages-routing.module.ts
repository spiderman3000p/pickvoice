import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ImportarPedidosComponent } from '../pages/importar-pedidos/importar-pedidos.component';
import { ImportarUbicacionesComponent } from '../pages/importar-ubicaciones/importar-ubicaciones.component';
import { ImportarItemsComponent } from '../pages/importar-items/importar-items.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    pathMatch: 'full'
  },
  {
    path: 'importaritems',
    component: ImportarItemsComponent,
    pathMatch: 'full'
  },
  {
    path: 'importarubicaciones',
    component: ImportarUbicacionesComponent,
    pathMatch: 'full'
  },
  {
    path: 'importarpedidos',
    component: ImportarPedidosComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
