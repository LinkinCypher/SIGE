import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientosPage } from './mantenimientos.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientosPageRoutingModule {}
