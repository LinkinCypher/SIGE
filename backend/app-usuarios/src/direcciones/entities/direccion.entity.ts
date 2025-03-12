import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DireccionDocument = Direccion & Document;

@Schema()
export class Direccion {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const DireccionSchema = SchemaFactory.createForClass(Direccion);