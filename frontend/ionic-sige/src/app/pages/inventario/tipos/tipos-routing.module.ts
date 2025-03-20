import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiposPage } from './tipos.page';

const routes: Routes = [
  {
    path: '',
    component: TiposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiposPageRoutingModule {}
