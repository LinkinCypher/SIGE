import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaginasService } from './paginas.service';
import { PermisosService } from '../../permisos/services/permisos.service';

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

      // Estructura de módulos y páginas básicas
      const estructuraBase = [
        // Módulo de Administración del Sistema
        {
          codigo: 'sistema',
          nombre: 'Administración del Sistema',
          descripcion: 'Configuración y administración general del sistema',
          ruta: '/admin/sistema',
          icono: 'settings',
          esModulo: true,
          permisoCodigo: 'usuarios.admin',
          orden: 1,
          subpaginas: [
            {
              codigo: 'sistema.usuarios',
              nombre: 'Gestión de Usuarios',
              descripcion: 'Administración de usuarios del sistema',
              ruta: '/admin/sistema/usuarios',
              icono: 'users',
              esModulo: false,
              permisoCodigo: 'usuarios.ver',
              orden: 1,
            },
            {
              codigo: 'sistema.permisos',
              nombre: 'Gestión de Permisos',
              descripcion: 'Administración de permisos y accesos',
              ruta: '/admin/sistema/permisos',
              icono: 'shield',
              esModulo: false,
              permisoCodigo: 'permisos.asignar',
              orden: 2,
            },
            {
              codigo: 'sistema.paginas',
              nombre: 'Gestión de Páginas',
              descripcion: 'Administración de páginas del sistema',
              ruta: '/admin/sistema/paginas',
              icono: 'layout',
              esModulo: false,
              permisoCodigo: 'paginas.admin',
              orden: 3,
            },
          ]
        },
        
        // Módulo de Estructura Organizacional
        {
          codigo: 'organizacion',
          nombre: 'Estructura Organizacional',
          descripcion: 'Gestión de la estructura organizativa',
          ruta: '/admin/organizacion',
          icono: 'git-branch',
          esModulo: true,
          permisoCodigo: 'direcciones.ver',
          orden: 2,
          subpaginas: [
            {
              codigo: 'organizacion.direcciones',
              nombre: 'Direcciones',
              descripcion: 'Gestión de direcciones de la organización',
              ruta: '/admin/organizacion/direcciones',
              icono: 'building',
              esModulo: false,
              permisoCodigo: 'direcciones.ver',
              orden: 1,
            },
            {
              codigo: 'organizacion.cargos',
              nombre: 'Cargos',
              descripcion: 'Gestión de cargos por dirección',
              ruta: '/admin/organizacion/cargos',
              icono: 'briefcase',
              esModulo: false,
              permisoCodigo: 'cargos.ver',
              orden: 2,
            },
          ]
        },
      ];

      // Crear módulos y páginas
      for (const modulo of estructuraBase) {
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