import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/modules/usuarios.module';
import { DireccionesModule } from './direcciones/modules/direcciones.module';
import { CargosModule } from './cargos/modules/cargos.module';
import { PermisosModule } from './permisos/modules/permisos.module';
import { UsuarioPermisosModule } from './usuario-permisos/modules/usuario-permisos.module';
import { AuthModule } from './auth/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsuariosModule,
    DireccionesModule,
    CargosModule,
    PermisosModule,
    UsuarioPermisosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}