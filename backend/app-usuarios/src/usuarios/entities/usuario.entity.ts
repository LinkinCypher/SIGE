import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  cargo: string;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ default: 'user' })
  role: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);