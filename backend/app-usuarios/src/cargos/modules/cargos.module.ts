import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CargosController } from '../controllers/cargos.controller';
import { CargosService } from '../services/cargos.service';
import { Cargo, CargoSchema } from '../entities/cargo.entity';
import { DireccionesModule } from '../../direcciones/modules/direcciones.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cargo.name, schema: CargoSchema },
    ]),
    DireccionesModule, // Importamos DireccionesModule para usar su servicio
  ],
  controllers: [CargosController],
  providers: [CargosService],
  exports: [CargosService],
})
export class CargosModule {}