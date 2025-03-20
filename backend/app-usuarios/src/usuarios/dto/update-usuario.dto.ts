import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBoolean, IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;

  @IsOptional()
  @IsArray({ message: 'Los permisos deben ser un array de cadenas' })
  @IsString({ each: true, message: 'Cada permiso debe ser una cadena de texto' })
  permisos?: string[];
}
