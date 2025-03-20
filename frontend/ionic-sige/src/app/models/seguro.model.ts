import { Equipo } from './equipo.model';

export interface HistorialItem {
  fecha: Date;
  estado: string;
  descripcion?: string;
  usuario: {
    id: string;
    nombre: string;
  };
}

export interface Seguro {
  _id?: string;
  equipo: string | Equipo;
  aseguradora?: string;
  numeroPoliza?: string;
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  valorAsegurado?: number;
  historial: HistorialItem[];
  creado?: {
    usuario: string;
    fecha: Date;
  };
  modificado?: {
    usuario: string;
    fecha: Date;
  };
  // Propiedades adicionales para formularios
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  nuevoHistorialItem?: any; // Para actualizaciones de estado
  historialItem?: any; // Para la creación inicial
}