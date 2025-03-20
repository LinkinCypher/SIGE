import { Equipo } from './equipo.model';

export interface Mantenimiento {
  _id?: string;
  equipo: string | Equipo;
  codigo: string;
  fecha: Date;
  memoriaRam?: string;
  discoDuro?: string;
  procesador?: string;
  sistemaOperativo?: string;
  observaciones?: string;
  tecnico: {
    id: string;
    nombre: string;
  };
  creado?: {
    usuario: string;
    fecha: Date;
  };
  modificado?: {
    usuario: string;
    fecha: Date;
  };
}