export const PaginasOrganizacion = {
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
  };