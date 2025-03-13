import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permiso, PermisoDocument } from '../entities/permiso.entity';

@Injectable()
export class InicializadorPermisosService implements OnModuleInit {
  private readonly logger = new Logger('InicializadorPermisosService');

  constructor(
    @InjectModel(Permiso.name) private permisoModel: Model<PermisoDocument>,
  ) {}

  async onModuleInit() {
    await this.inicializarPermisos();
  }

  private async inicializarPermisos() {
    const permisosBasicos = [
      // Permisos de Usuarios
      { 
        codigo: 'usuarios.ver', 
        nombre: 'Ver Usuarios', 
        descripcion: 'Permite ver la lista de usuarios y sus detalles'
      },
      { 
        codigo: 'usuarios.crear', 
        nombre: 'Crear Usuarios', 
        descripcion: 'Permite crear nuevos usuarios'
      },
      { 
        codigo: 'usuarios.editar', 
        nombre: 'Editar Usuarios', 
        descripcion: 'Permite editar datos de usuarios existentes'
      },
      { 
        codigo: 'usuarios.eliminar', 
        nombre: 'Eliminar Usuarios', 
        descripcion: 'Permite eliminar usuarios'
      },
      { 
        codigo: 'usuarios.admin', 
        nombre: 'Administrar Usuarios', 
        descripcion: 'Acceso completo a todas las funciones de usuarios'
      },
      
      // Permisos de Direcciones
      { 
        codigo: 'direcciones.ver', 
        nombre: 'Ver Direcciones', 
        descripcion: 'Permite ver la lista de direcciones y sus detalles'
      },
      { 
        codigo: 'direcciones.crear', 
        nombre: 'Crear Direcciones', 
        descripcion: 'Permite crear nuevas direcciones'
      },
      { 
        codigo: 'direcciones.editar', 
        nombre: 'Editar Direcciones', 
        descripcion: 'Permite editar direcciones existentes'
      },
      { 
        codigo: 'direcciones.eliminar', 
        nombre: 'Eliminar Direcciones', 
        descripcion: 'Permite eliminar direcciones'
      },
      
      // Permisos de Cargos
      { 
        codigo: 'cargos.ver', 
        nombre: 'Ver Cargos', 
        descripcion: 'Permite ver la lista de cargos y sus detalles'
      },
      { 
        codigo: 'cargos.crear', 
        nombre: 'Crear Cargos', 
        descripcion: 'Permite crear nuevos cargos'
      },
      { 
        codigo: 'cargos.editar', 
        nombre: 'Editar Cargos', 
        descripcion: 'Permite editar cargos existentes'
      },
      { 
        codigo: 'cargos.eliminar', 
        nombre: 'Eliminar Cargos', 
        descripcion: 'Permite eliminar cargos'
      },
      
      // Permisos de Gestión de Permisos
      { 
        codigo: 'permisos.ver', 
        nombre: 'Ver Permisos', 
        descripcion: 'Permite ver los permisos asignados a usuarios'
      },
      { 
        codigo: 'permisos.asignar', 
        nombre: 'Asignar Permisos', 
        descripcion: 'Permite asignar permisos a usuarios'
      },
      { 
        codigo: 'permisos.revocar', 
        nombre: 'Revocar Permisos', 
        descripcion: 'Permite revocar permisos de usuarios'
      },
      { 
        codigo: 'permisos.admin', 
        nombre: 'Administrar Permisos', 
        descripcion: 'Acceso completo a todas las funciones de permisos'
      },
      // Permisos de Páginas
      { 
        codigo: 'paginas.ver', 
        nombre: 'Ver Páginas', 
        descripcion: 'Permite ver la lista de páginas del sistema'
      },
      { 
        codigo: 'paginas.crear', 
        nombre: 'Crear Páginas', 
        descripcion: 'Permite crear nuevas páginas en el sistema'
      },
      { 
        codigo: 'paginas.editar', 
        nombre: 'Editar Páginas', 
        descripcion: 'Permite editar páginas existentes'
      },
      { 
        codigo: 'paginas.eliminar', 
        nombre: 'Eliminar Páginas', 
        descripcion: 'Permite eliminar páginas'
      },
      { 
        codigo: 'paginas.admin', 
        nombre: 'Administrar Páginas', 
        descripcion: 'Acceso completo a la gestión de páginas del sistema'
      },
    ];

    // Verificar cuáles permisos ya existen
    const permisosExistentes = await this.permisoModel.find({
      codigo: { $in: permisosBasicos.map(p => p.codigo) }
    }).exec();

    const codigosExistentes = permisosExistentes.map(p => p.codigo);
    
    // Filtrar solo los permisos que no existen aún
    const permisosNuevos = permisosBasicos.filter(
      p => !codigosExistentes.includes(p.codigo)
    );

    if (permisosNuevos.length > 0) {
      await this.permisoModel.insertMany(permisosNuevos);
      this.logger.log(`Se han creado ${permisosNuevos.length} permisos básicos`);
    } else {
      this.logger.log('Todos los permisos básicos ya existen');
    }
  }
}