import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DireccionesController } from '../controllers/direcciones.controller';
import { DireccionesService } from '../services/direcciones.service';
import { Direccion, DireccionSchema } from '../entities/direccion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Direccion.name, schema: DireccionSchema },
    ]),
  ],
  controllers: [DireccionesController],
  providers: [DireccionesService],
  exports: [DireccionesService],
})
export class DireccionesModule {}