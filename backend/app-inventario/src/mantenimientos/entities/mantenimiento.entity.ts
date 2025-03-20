import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MantenimientoDocument = Mantenimiento & Document;

@Schema({
  timestamps: true,
  collection: 'mantenimientos'
})
export class Mantenimiento {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  })
  equipo: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop()
  memoriaRam: string;

  @Prop()
  discoDuro: string;

  @Prop()
  procesador: string;

  @Prop()
  sistemaOperativo: string;

  @Prop()
  observaciones: string;

  @Prop({
    type: {
      id: { type: MongooseSchema.Types.ObjectId },
      nombre: { type: String }
    }
  })
  tecnico: {
    id: MongooseSchema.Types.ObjectId;
    nombre: string;
  };

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

export const MantenimientoSchema = SchemaFactory.createForClass(Mantenimiento);