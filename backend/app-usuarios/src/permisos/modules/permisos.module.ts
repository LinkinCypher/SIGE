import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermisosController } from '../controllers/permisos.controller';
import { PermisosService } from '../services/permisos.service';
import { Permiso, PermisoSchema } from '../entities/permiso.entity';
import { InicializadorPermisosService } from '../services/inicializador-permisos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permiso.name, schema: PermisoSchema },
    ]),
  ],
  controllers: [PermisosController],
  providers: [PermisosService, InicializadorPermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}