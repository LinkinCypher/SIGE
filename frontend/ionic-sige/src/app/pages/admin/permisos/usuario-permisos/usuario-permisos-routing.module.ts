import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioPermisosPage } from './usuario-permisos.page';

const routes: Routes = [
  {
    path: '',
    component: UsuarioPermisosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioPermisosPageRoutingModule {}
