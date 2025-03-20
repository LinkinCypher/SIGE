import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquiposController } from '../controllers/equipos.controller';
import { EquiposService } from '../services/equipos.service';
import { Equipo, EquipoSchema } from '../entities/equipo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipo.name, schema: EquipoSchema },
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule {}