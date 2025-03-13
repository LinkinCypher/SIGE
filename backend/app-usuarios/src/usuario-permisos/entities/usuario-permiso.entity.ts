import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';

export type UsuarioPermisoDocument = UsuarioPermiso & Document;

@Schema()
export class UsuarioPermiso {
  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  })
  usuarioId: MongooseSchema.Types.ObjectId;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Permiso', 
    required: true 
  })
  permisoId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  fechaAsignacion: Date;

  @Prop()
  asignadoPor: string; // ID o nombre del usuario que asignó el permiso
}

export const UsuarioPermisoSchema = SchemaFactory.createForClass(UsuarioPermiso);

// Índice compuesto para garantizar que no haya duplicados de la misma asignación
UsuarioPermisoSchema.index({ usuarioId: 1, permisoId: 1 }, { unique: true });