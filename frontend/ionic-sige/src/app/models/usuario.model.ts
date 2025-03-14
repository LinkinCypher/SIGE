export interface Usuario {
  _id?: string;
  username: string;
  nombre: string;
  apellido: string;
  cargo?: string;
  cargoId?: string;
  direccion?: string;
  direccionId?: string;
  role: string;
  fechaNacimiento?: Date;
  email?: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion?: Date;
  ultimoAcceso?: Date;
  permisos?: string[];
}