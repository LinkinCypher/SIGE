import { Tipo } from './tipo.model';
import { Marca } from './marca.model';

export interface Equipo {
  _id?: string;
  tipo: string | Tipo;
  marca: string | Marca;
  modelo: string;
  serie: string;
  codigo: string;
  fechaAdquisicion: Date | string;
  activo: boolean;
  creado?: {
    usuario: string;
    fecha: Date;
  };
  modificado?: {
    usuario: string;
    fecha: Date;
  };
  // Propiedades para formularios
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}