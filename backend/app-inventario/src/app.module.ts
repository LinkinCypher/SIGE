import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiposModule } from './tipos/modules/tipos.module';
import { MarcasModule } from './marcas/modules/marcas.module';
import { EquiposModule } from './equipos/modules/equipos.module';
import { MantenimientosModule } from './mantenimientos/modules/mantenimientos.module';
import { SegurosModule } from './seguros/modules/seguros.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    
    // Módulos de la aplicación
    TiposModule,
    MarcasModule,
    EquiposModule,
    MantenimientosModule,
    SegurosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}