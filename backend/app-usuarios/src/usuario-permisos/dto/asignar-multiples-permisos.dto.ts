import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class AsignarMultiplesPermisosDto {
  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsMongoId({ message: 'El ID de usuario debe ser un ObjectId válido' })
  usuarioId: Types.ObjectId | string;

  @IsArray({ message: 'Los IDs de permisos deben ser un arreglo' })
  @IsMongoId({ each: true, message: 'Cada ID de permiso debe ser un ObjectId válido' })
  permisoIds: (Types.ObjectId | string)[];

  @IsOptional()
  @IsString({ message: 'El campo asignadoPor debe ser una cadena de texto' })
  asignadoPor?: string;
}