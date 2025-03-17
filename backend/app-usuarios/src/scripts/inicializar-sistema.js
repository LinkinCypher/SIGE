/////////////////////////////////////////////////////////////////
//      ejecutar: node src/scripts/inicializar-sistema.js      //
//  crea en la base de datos el usuario admin contraseña admin //
/////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/sige');

// Definir esquemas básicos para la inicialización
const DireccionSchema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  descripcion: String,
  activo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const CargoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  direccionId: mongoose.Schema.Types.ObjectId,
  activo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const UsuarioSchema = new mongoose.Schema({
  username: String,
  password: String,
  nombre: String,
  apellido: String,
  direccionId: mongoose.Schema.Types.ObjectId,
  cargoId: mongoose.Schema.Types.ObjectId,
  fechaNacimiento: Date,
  role: String,
  activo: Boolean,
  email: String,
  telefono: String,
  fechaCreacion: Date,
  fechaActualizacion: Date,
  ultimoAcceso: Date
});

const PermisoSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  activo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const UsuarioPermisoSchema = new mongoose.Schema({
  usuarioId: mongoose.Schema.Types.ObjectId,
  permisoId: mongoose.Schema.Types.ObjectId,
  fechaAsignacion: Date,
  asignadoPor: String
});

const PaginaSchema = new mongoose.Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  ruta: String,
  icono: String,
  moduloPadreId: { type: mongoose.Schema.Types.ObjectId, default: null },
  permisoId: mongoose.Schema.Types.ObjectId,
  orden: Number,
  activo: Boolean,
  esModulo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const Direccion = mongoose.model('Direccion', DireccionSchema);
const Cargo = mongoose.model('Cargo', CargoSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Permiso = mongoose.model('Permiso', PermisoSchema);
const UsuarioPermiso = mongoose.model('UsuarioPermiso', UsuarioPermisoSchema);
const Pagina = mongoose.model('Pagina', PaginaSchema);

async function inicializarSistema() {
  try {
    console.log('Iniciando la inicialización del sistema...');
    
    // 1. Crear una dirección
    const direccion = new Direccion({
      nombre: 'Dirección General',
      codigo: 'DG',
      descripcion: 'Dirección principal del sistema',
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await direccion.save();
    console.log('✅ Dirección creada:', direccion._id);
    
    // 2. Crear un cargo
    const cargo = new Cargo({
      nombre: 'Administrador',
      descripcion: 'Administrador del sistema',
      direccionId: direccion._id,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await cargo.save();
    console.log('✅ Cargo creado:', cargo._id);
    
    // 3. Crear un usuario administrador
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    
    const usuario = new Usuario({
      username: 'admin',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      direccionId: direccion._id,
      cargoId: cargo._id,
      fechaNacimiento: new Date('1990-01-01'),
      role: 'admin',
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await usuario.save();
    console.log('✅ Usuario administrador creado:', usuario._id);
    
    // 4. Crear permisos básicos
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
      
      // Permisos de Permisos
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
    ];

    const permisosCreados = [];
    
    for (const permisoData of permisosBasicos) {
      const permiso = new Permiso({
        codigo: permisoData.codigo,
        nombre: permisoData.nombre,
        descripcion: permisoData.descripcion,
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      });
      
      await permiso.save();
      permisosCreados.push(permiso);
      
      // Asignar permiso al usuario admin
      const usuarioPermiso = new UsuarioPermiso({
        usuarioId: usuario._id,
        permisoId: permiso._id,
        fechaAsignacion: new Date(),
        asignadoPor: 'Sistema'
      });
      
      await usuarioPermiso.save();
    }
    
    console.log(`✅ Creados y asignados ${permisosCreados.length} permisos al administrador`);
    
    // 5. Crear estructura de páginas básicas
    // Módulo de Administración del Sistema
    const moduloSistema = new Pagina({
      codigo: 'sistema',
      nombre: 'Administración del Sistema',
      descripcion: 'Configuración y administración general del sistema',
      ruta: '/admin/sistema',
      icono: 'settings',
      moduloPadreId: null,
      permisoId: permisosCreados.find(p => p.codigo === 'usuarios.admin')._id,
      orden: 1,
      activo: true,
      esModulo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await moduloSistema.save();
    
    // Páginas del módulo Sistema
    const paginasSistema = [
      {
        codigo: 'sistema.usuarios',
        nombre: 'Gestión de Usuarios',
        descripcion: 'Administración de usuarios del sistema',
        ruta: '/admin/sistema/usuarios',
        icono: 'users',
        moduloPadreId: moduloSistema._id,
        permisoId: permisosCreados.find(p => p.codigo === 'usuarios.ver')._id,
        orden: 1,
        activo: true,
        esModulo: false
      },
      {
        codigo: 'sistema.permisos',
        nombre: 'Gestión de Permisos',
        descripcion: 'Administración de permisos y accesos',
        ruta: '/admin/sistema/permisos',
        icono: 'shield',
        moduloPadreId: moduloSistema._id,
        permisoId: permisosCreados.find(p => p.codigo === 'permisos.asignar')._id,
        orden: 2,
        activo: true,
        esModulo: false
      },
      {
        codigo: 'sistema.paginas',
        nombre: 'Gestión de Páginas',
        descripcion: 'Administración de páginas del sistema',
        ruta: '/admin/sistema/paginas',
        icono: 'layout',
        moduloPadreId: moduloSistema._id,
        permisoId: permisosCreados.find(p => p.codigo === 'paginas.admin')._id,
        orden: 3,
        activo: true,
        esModulo: false
      }
    ];
    
    for (const paginaData of paginasSistema) {
      const pagina = new Pagina({
        ...paginaData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      });
      
      await pagina.save();
    }
    
    // Módulo de Estructura Organizacional
    const moduloOrganizacion = new Pagina({
      codigo: 'organizacion',
      nombre: 'Estructura Organizacional',
      descripcion: 'Gestión de la estructura organizativa',
      ruta: '/admin/organizacion',
      icono: 'git-branch',
      moduloPadreId: null,
      permisoId: permisosCreados.find(p => p.codigo === 'direcciones.ver')._id,
      orden: 2,
      activo: true,
      esModulo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await moduloOrganizacion.save();
    
    // Páginas del módulo Organización
    const paginasOrganizacion = [
      {
        codigo: 'organizacion.direcciones',
        nombre: 'Direcciones',
        descripcion: 'Gestión de direcciones de la organización',
        ruta: '/admin/organizacion/direcciones',
        icono: 'building',
        moduloPadreId: moduloOrganizacion._id,
        permisoId: permisosCreados.find(p => p.codigo === 'direcciones.ver')._id,
        orden: 1,
        activo: true,
        esModulo: false
      },
      {
        codigo: 'organizacion.cargos',
        nombre: 'Cargos',
        descripcion: 'Gestión de cargos por dirección',
        ruta: '/admin/organizacion/cargos',
        icono: 'briefcase',
        moduloPadreId: moduloOrganizacion._id,
        permisoId: permisosCreados.find(p => p.codigo === 'cargos.ver')._id,
        orden: 2,
        activo: true,
        esModulo: false
      }
    ];
    
    for (const paginaData of paginasOrganizacion) {
      const pagina = new Pagina({
        ...paginaData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      });
      
      await pagina.save();
    }
    
    console.log('✅ Estructura de páginas creada correctamente');
    
    console.log('✅ Sistema inicializado correctamente');
    console.log('👤 Usuario: admin');
    console.log('🔑 Contraseña: admin');
  } catch (error) {
    console.error('❌ Error al inicializar el sistema:', error);
  } finally {
    mongoose.disconnect();
  }
}

inicializarSistema();