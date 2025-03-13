import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaginasService } from './paginas.service';
import { PermisosService } from '../../permisos/services/permisos.service';
import { TodosLosModulos } from '../../catalogos';

@Injectable()
export class InicializadorPaginasService implements OnModuleInit {
  private readonly logger = new Logger('InicializadorPaginasService');

  constructor(
    private paginasService: PaginasService,
    private permisosService: PermisosService,
  ) {}

  async onModuleInit() {
    await this.inicializarPaginasBasicas();
  }

  private async inicializarPaginasBasicas() {
    try {
      // Verificar si ya existen páginas
      const paginasExistentes = await this.paginasService.findAll();
      
      if (paginasExistentes.length > 0) {
        this.logger.log('Ya existen páginas en el sistema. Omitiendo inicialización.');
        return;
      }

      // Crear módulos y páginas
      for (const modulo of TodosLosModulos) {
        try {
          // Obtener el permiso correspondiente
          const permisoModulo = await this.permisosService.findByCode(modulo.permisoCodigo);
          
          // Crear el módulo
          const moduloCreado = await this.paginasService.create({
            codigo: modulo.codigo,
            nombre: modulo.nombre,
            descripcion: modulo.descripcion,
            ruta: modulo.ruta,
            icono: modulo.icono,
            esModulo: modulo.esModulo,
            permisoId: permisoModulo['_id'],
            orden: modulo.orden,
          });
          
          // Crear subpáginas
          for (const subpagina of modulo.subpaginas) {
            try {
              const permisoSubpagina = await this.permisosService.findByCode(subpagina.permisoCodigo);
              
              await this.paginasService.create({
                codigo: subpagina.codigo,
                nombre: subpagina.nombre,
                descripcion: subpagina.descripcion,
                ruta: subpagina.ruta,
                icono: subpagina.icono,
                esModulo: subpagina.esModulo,
                moduloPadreId: moduloCreado['_id'],
                permisoId: permisoSubpagina['_id'],
                orden: subpagina.orden,
              });
            } catch (error) {
              this.logger.warn(`No se pudo crear la subpágina ${subpagina.codigo}: ${error.message}`);
            }
          }
        } catch (error) {
          this.logger.warn(`No se pudo crear el módulo ${modulo.codigo}: ${error.message}`);
        }
      }
      
      this.logger.log('Páginas básicas inicializadas correctamente');
    } catch (error) {
      this.logger.error('Error al inicializar páginas básicas', error.stack);
    }
  }
}