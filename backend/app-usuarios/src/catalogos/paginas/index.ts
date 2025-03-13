import { PaginasSistema } from './sistema';
import { PaginasOrganizacion } from './organizacion';

export interface SubpaginaDefinicion {
  codigo: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
  esModulo: boolean;
  permisoCodigo: string;
  orden: number;
}

export interface PaginaDefinicion {
  codigo: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
  esModulo: boolean;
  permisoCodigo: string;
  orden: number;
  subpaginas: SubpaginaDefinicion[];
}

// Exportamos cada grupo por separado
export {
  PaginasSistema,
  PaginasOrganizacion
};

// Exportamos todos los módulos de páginas juntos
export const TodosLosModulos: PaginaDefinicion[] = [
  PaginasSistema,
  PaginasOrganizacion
];