import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientosPageRoutingModule } from './mantenimientos-routing.module';

import { MantenimientosPage } from './mantenimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientosPageRoutingModule
  ],
  declarations: [MantenimientosPage]
})
export class MantenimientosPageModule {}
