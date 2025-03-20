import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SegurosPageRoutingModule } from './seguros-routing.module';

import { SegurosPage } from './seguros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SegurosPageRoutingModule
  ],
  declarations: [SegurosPage]
})
export class SegurosPageModule {}
