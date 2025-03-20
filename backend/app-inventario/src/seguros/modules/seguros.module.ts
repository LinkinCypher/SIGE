import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SegurosController } from '../controllers/seguros.controller';
import { SegurosService } from '../services/seguros.service';
import { Seguro, SeguroSchema } from '../entities/seguro.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seguro.name, schema: SeguroSchema },
    ]),
  ],
  controllers: [SegurosController],
  providers: [SegurosService],
  exports: [SegurosService],
})
export class SegurosModule {}