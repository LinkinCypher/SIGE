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
  fechaInicio?: Date;
  fechaFin?: Date;
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
}