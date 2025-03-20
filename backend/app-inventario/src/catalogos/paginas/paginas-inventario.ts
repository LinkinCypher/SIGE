export const PaginasInventario = {
    codigo: 'inventario',
    nombre: 'Gestión de Inventario',
    descripcion: 'Administración del inventario tecnológico',
    ruta: '/admin/inventario',
    icono: 'inventory_2',
    esModulo: true,
    permisoCodigo: 'inventario.equipos.ver',
    orden: 2,
    subpaginas: [
      {
        codigo: 'equipos',
        nombre: 'Equipos',
        descripcion: 'Gestión de equipos tecnológicos',
        ruta: '/admin/inventario/equipos',
        icono: 'devices',
        permisoCodigo: 'inventario.equipos.ver',
        orden: 1
      },
      {
        codigo: 'tipos',
        nombre: 'Tipos de Equipo',
        descripcion: 'Administración de tipos de equipo',
        ruta: '/admin/inventario/tipos',
        icono: 'category',
        permisoCodigo: 'inventario.tipos.ver',
        orden: 2
      },
      {
        codigo: 'marcas',
        nombre: 'Marcas',
        descripcion: 'Administración de marcas',
        ruta: '/admin/inventario/marcas',
        icono: 'branding_watermark',
        permisoCodigo: 'inventario.marcas.ver',
        orden: 3
      },
      {
        codigo: 'mantenimientos',
        nombre: 'Mantenimientos',
        descripcion: 'Registro y consulta de mantenimientos',
        ruta: '/admin/inventario/mantenimientos',
        icono: 'build',
        permisoCodigo: 'inventario.mantenimientos.ver',
        orden: 4
      },
      {
        codigo: 'seguros',
        nombre: 'Seguros',
        descripcion: 'Gestión de seguros de equipos',
        ruta: '/admin/inventario/seguros',
        icono: 'security',
        permisoCodigo: 'inventario.seguros.ver',
        orden: 5
      }
    ]
  };
  
  export const TodasLasPaginas = [
    PaginasInventario,
  ];