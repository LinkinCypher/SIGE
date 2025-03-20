// src/app/models/tipo.model.ts
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
  // Añadimos estas propiedades para el formulario
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}