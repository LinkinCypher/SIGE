import { PermisosUsuarios } from './usuarios';
import { PermisosDirections } from './direcciones';
import { PermisosCargos } from './cargos';
import { PermisosPaginas } from './paginas';
import { PermisosPermisos } from './permisos';

export interface PermisoDefinicion {
  codigo: string;
  nombre: string;
  descripcion: string;
}

// Exportamos cada grupo por separado
export { 
  PermisosUsuarios,
  PermisosDirections,
  PermisosCargos,
  PermisosPaginas,
  PermisosPermisos
};

// Exportamos todos los permisos juntos en un solo array
export const TodosLosPermisos: PermisoDefinicion[] = [
  ...PermisosUsuarios,
  ...PermisosDirections,
  ...PermisosCargos,
  ...PermisosPaginas,
  ...PermisosPermisos
];