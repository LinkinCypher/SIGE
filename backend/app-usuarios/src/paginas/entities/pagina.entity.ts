import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Permiso } from '../../permisos/entities/permiso.entity';

export type PaginaDocument = Pagina & Document;

@Schema()
export class Pagina {
  @Prop({ required: true, unique: true })
  codigo: string; // Código único: "usuarios.lista", "bodega.inventario"

  @Prop({ required: true })
  nombre: string; // Nombre amigable: "Lista de Usuarios", "Gestión de Inventario"

  @Prop()
  descripcion: string; // Descripción detallada

  @Prop({ required: true })
  ruta: string; // Ruta en el frontend: "/usuarios/lista", "/bodega/inventario"

  @Prop()
  icono: string; // Nombre del icono (opcional)

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId, ref: 'Pagina' })
  moduloPadreId: MongooseSchema.Types.ObjectId; // Referencia a la página padre (si es un submódulo)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Permiso', required: true })
  permisoId: MongooseSchema.Types.ObjectId; // Permiso requerido para acceder

  @Prop({ default: 0 })
  orden: number; // Orden de visualización

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: false })
  esModulo: boolean; // Indica si es un módulo contenedor o una página final

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const PaginaSchema = SchemaFactory.createForClass(Pagina);