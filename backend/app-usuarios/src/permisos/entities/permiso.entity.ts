import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermisoDocument = Permiso & Document;

@Schema()
export class Permiso {
  @Prop({ required: true, unique: true })
  codigo: string; // Ej: "usuarios.ver", "bodega.crear"

  @Prop({ required: true })
  nombre: string; // Nombre descriptivo: "Ver usuarios", "Crear en bodega"

  @Prop()
  descripcion: string; // Descripción detallada del permiso

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const PermisoSchema = SchemaFactory.createForClass(Permiso);