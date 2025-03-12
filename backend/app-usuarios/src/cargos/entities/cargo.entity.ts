import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Direccion } from '../../direcciones/entities/direccion.entity';

export type CargoDocument = Cargo & Document;

@Schema()
export class Cargo {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Direccion', 
    required: true 
  })
  direccionId: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const CargoSchema = SchemaFactory.createForClass(Cargo);

// Índice compuesto para evitar nombres duplicados dentro de la misma dirección
CargoSchema.index({ nombre: 1, direccionId: 1 }, { unique: true });