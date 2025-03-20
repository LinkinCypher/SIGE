import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SeguroDocument = Seguro & Document;

@Schema({
  timestamps: true,
  collection: 'seguros'
})
export class Seguro {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  })
  equipo: MongooseSchema.Types.ObjectId;

  @Prop()
  aseguradora: string;

  @Prop()
  numeroPoliza: string;

  @Prop()
  fechaInicio: Date;

  @Prop()
  fechaFin: Date;

  @Prop()
  valorAsegurado: number;

  @Prop({
    type: [{
      fecha: { type: Date, default: Date.now },
      estado: { type: String, required: true },
      descripcion: { type: String },
      usuario: {
        id: { type: MongooseSchema.Types.ObjectId },
        nombre: { type: String }
      }
    }]
  })
  historial: {
    fecha: Date;
    estado: string;
    descripcion: string;
    usuario: {
      id: MongooseSchema.Types.ObjectId;
      nombre: string;
    };
  }[];

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

export const SeguroSchema = SchemaFactory.createForClass(Seguro);