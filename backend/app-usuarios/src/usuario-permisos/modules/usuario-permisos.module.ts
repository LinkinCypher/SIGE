import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioPermisosController } from '../controllers/usuario-permisos.controller';
import { UsuarioPermisosService } from '../services/usuario-permisos.service';
import { UsuarioPermiso, UsuarioPermisoSchema } from '../entities/usuario-permiso.entity';
import { UsuariosModule } from '../../usuarios/modules/usuarios.module';
import { PermisosModule } from '../../permisos/modules/permisos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsuarioPermiso.name, schema: UsuarioPermisoSchema },
    ]),
    UsuariosModule, // Para acceder a UsuariosService
    PermisosModule, // Para acceder a PermisosService
  ],
  controllers: [UsuarioPermisosController],
  providers: [UsuarioPermisosService],
  exports: [UsuarioPermisosService],
})
export class UsuarioPermisosModule {}