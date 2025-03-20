import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarcaDocument = Marca & Document;

@Schema({
  timestamps: true,
  collection: 'marcas'
})
export class Marca {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  descripcion: string;

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

export const MarcaSchema = SchemaFactory.createForClass(Marca);