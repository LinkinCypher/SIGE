import { PartialType } from '@nestjs/mapped-types';
import { CreatePermisoDto } from './create-permiso.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePermisoDto extends PartialType(CreatePermisoDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}