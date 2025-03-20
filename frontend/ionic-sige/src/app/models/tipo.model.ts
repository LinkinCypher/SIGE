export interface CampoEspecifico {
    nombre: string;
    tipo: string;
    requerido: boolean;
    opciones?: string[];
  }
  
  export interface Tipo {
    _id?: string;
    nombre: string;
    descripcion?: string;
    camposEspecificos?: CampoEspecifico[];
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