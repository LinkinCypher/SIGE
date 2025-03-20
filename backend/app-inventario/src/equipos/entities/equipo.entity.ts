import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EquipoDocument = Equipo & Document;

@Schema({
  timestamps: true,
  collection: 'equipos'
})
export class Equipo {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tipo',
    required: true
  })
  tipo: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Marca',
    required: true
  })
  marca: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true })
  serie: string;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  fechaAdquisicion: Date;

  @Prop({ default: true })
  activo: boolean;

  @Prop({
    type: {
      usuario: { type: String },
      fecha: { type: Date, default: Date.now }
    }
  })
  creado: {
    usuario: string;
    fecha: Date;
  };

  @Prop({
    type: {
      usuario: { type: String },
      fecha: { type: Date, default: Date.now }
    }
  })
  modificado: {
    usuario: string;
    fecha: Date;
  };
}

export const EquipoSchema = SchemaFactory.createForClass(Equipo);