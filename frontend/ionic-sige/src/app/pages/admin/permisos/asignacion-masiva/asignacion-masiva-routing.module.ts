import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignacionMasivaPage } from './asignacion-masiva.page';

const routes: Routes = [
  {
    path: '',
    component: AsignacionMasivaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionMasivaPageRoutingModule {}
