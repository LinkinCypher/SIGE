import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MantenimientosController } from '../controllers/mantenimientos.controller';
import { MantenimientosService } from '../services/mantenimientos.service';
import { Mantenimiento, MantenimientoSchema } from '../entities/mantenimiento.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mantenimiento.name, schema: MantenimientoSchema },
    ]),
  ],
  controllers: [MantenimientosController],
  providers: [MantenimientosService],
  exports: [MantenimientosService],
})
export class MantenimientosModule {}