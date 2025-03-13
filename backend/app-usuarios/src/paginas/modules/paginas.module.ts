import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginasController } from '../controllers/paginas.controller';
import { PaginasService } from '../services/paginas.service';
import { Pagina, PaginaSchema } from '../entities/pagina.entity';
import { PermisosModule } from '../../permisos/modules/permisos.module';
import { InicializadorPaginasService } from '../services/inicializador-paginas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pagina.name, schema: PaginaSchema },
    ]),
    PermisosModule, // Para acceder a PermisosService
  ],
  controllers: [PaginasController],
  providers: [PaginasService, InicializadorPaginasService],
  exports: [PaginasService],
})
export class PaginasModule {}