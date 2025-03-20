export const PermisosInventario = [
    // Permisos para equipos
    {
      codigo: 'inventario.equipos.ver',
      nombre: 'Ver Equipos',
      descripcion: 'Permite ver la lista de equipos y sus detalles'
    },
    {
      codigo: 'inventario.equipos.crear',
      nombre: 'Crear Equipos',
      descripcion: 'Permite crear nuevos equipos en el inventario'
    },
    {
      codigo: 'inventario.equipos.editar',
      nombre: 'Editar Equipos',
      descripcion: 'Permite modificar la información de equipos existentes'
    },
    {
      codigo: 'inventario.equipos.eliminar',
      nombre: 'Eliminar Equipos',
      descripcion: 'Permite eliminar (desactivar) equipos del inventario'
    },
    
    // Permisos para catálogos (tipos y marcas)
    {
      codigo: 'inventario.tipos.ver',
      nombre: 'Ver Tipos de Equipo',
      descripcion: 'Permite ver los tipos de equipo disponibles'
    },
    {
      codigo: 'inventario.tipos.administrar',
      nombre: 'Administrar Tipos de Equipo',
      descripcion: 'Permite crear, editar y eliminar tipos de equipo'
    },
    {
      codigo: 'inventario.marcas.ver',
      nombre: 'Ver Marcas',
      descripcion: 'Permite ver las marcas disponibles'
    },
    {
      codigo: 'inventario.marcas.administrar',
      nombre: 'Administrar Marcas',
      descripcion: 'Permite crear, editar y eliminar marcas'
    },
    
    // Permisos para mantenimientos
    {
      codigo: 'inventario.mantenimientos.ver',
      nombre: 'Ver Mantenimientos',
      descripcion: 'Permite ver el historial de mantenimientos'
    },
    {
      codigo: 'inventario.mantenimientos.crear',
      nombre: 'Registrar Mantenimientos',
      descripcion: 'Permite registrar nuevos mantenimientos'
    },
    {
      codigo: 'inventario.mantenimientos.editar',
      nombre: 'Editar Mantenimientos',
      descripcion: 'Permite modificar mantenimientos registrados'
    },
    
    // Permisos para seguros
    {
      codigo: 'inventario.seguros.ver',
      nombre: 'Ver Seguros',
      descripcion: 'Permite ver información de seguros'
    },
    {
      codigo: 'inventario.seguros.administrar',
      nombre: 'Administrar Seguros',
      descripcion: 'Permite gestionar y actualizar seguros'
    }
  ];
  
  // Exportar todos los permisos en un solo array
  export const TodosLosPermisos = [
    ...PermisosInventario,
  ];