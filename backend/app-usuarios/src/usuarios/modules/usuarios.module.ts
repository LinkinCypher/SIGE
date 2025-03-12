import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from '../controllers/usuarios.controller';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario, UsuarioSchema } from '../entities/usuario.entity';
import { DireccionesModule } from '../../direcciones/modules/direcciones.module';
import { CargosModule } from '../../cargos/modules/cargos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
    DireccionesModule, // Importar el módulo de direcciones
    CargosModule, // Importar el módulo de cargos
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}