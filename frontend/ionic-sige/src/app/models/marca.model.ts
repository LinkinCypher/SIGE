export interface Marca {
    _id?: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    creado?: {
      usuario: string;
      fecha: Date;
    };
    modificado?: {
      usuario: string;
      fecha: Date;
    };
  }