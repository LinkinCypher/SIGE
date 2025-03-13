import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AsignarPermisoDto {
  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsMongoId({ message: 'El ID de usuario debe ser un ObjectId válido' })
  usuarioId: Types.ObjectId | string;

  @IsNotEmpty({ message: 'El ID de permiso es requerido' })
  @IsMongoId({ message: 'El ID de permiso debe ser un ObjectId válido' })
  permisoId: Types.ObjectId | string;

  @IsOptional()
  @IsString({ message: 'El campo asignadoPor debe ser una cadena de texto' })
  asignadoPor?: string;
}