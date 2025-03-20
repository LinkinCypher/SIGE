import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TiposController } from '../controllers/tipos.controller';
import { TiposService } from '../services/tipos.service';
import { Tipo, TipoSchema } from '../entities/tipo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tipo.name, schema: TipoSchema },
    ]),
  ],
  controllers: [TiposController],
  providers: [TiposService],
  exports: [TiposService],
})
export class TiposModule {}