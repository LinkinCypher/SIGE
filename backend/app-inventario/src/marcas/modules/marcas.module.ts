import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarcasController } from '../controllers/marcas.controller';
import { MarcasService } from '../services/marcas.service';
import { Marca, MarcaSchema } from '../entities/marca.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Marca.name, schema: MarcaSchema },
    ]),
  ],
  controllers: [MarcasController],
  providers: [MarcasService],
  exports: [MarcasService],
})
export class MarcasModule {}