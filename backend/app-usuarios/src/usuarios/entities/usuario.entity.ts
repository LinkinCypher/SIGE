import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Direccion', 
    required: true 
  })
  direccionId: MongooseSchema.Types.ObjectId;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Cargo', 
    required: true 
  })
  cargoId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  telefono: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;

  @Prop({ default: null })
  ultimoAcceso: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);