import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TipoDocument = Tipo & Document;

@Schema({
  timestamps: true,
  collection: 'tipos'
})
export class Tipo {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop([{
    nombre: String,
    tipo: String,
    requerido: Boolean,
    opciones: [String]
  }])
  camposEspecificos: {
    nombre: string;
    tipo: string;
    requerido: boolean;
    opciones?: string[];
  }[];

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

export const TipoSchema = SchemaFactory.createForClass(Tipo);