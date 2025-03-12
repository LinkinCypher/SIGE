import { PartialType } from '@nestjs/mapped-types';
import { CreateCargoDto } from './create-cargo.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCargoDto extends PartialType(CreateCargoDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}