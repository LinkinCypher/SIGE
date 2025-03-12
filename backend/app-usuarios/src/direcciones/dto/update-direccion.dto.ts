import { PartialType } from '@nestjs/mapped-types';
import { CreateDireccionDto } from './create-direccion.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDireccionDto extends PartialType(CreateDireccionDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}