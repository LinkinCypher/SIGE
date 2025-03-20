import { PartialType } from '@nestjs/mapped-types';
import { CreateMantenimientoDto } from './create-mantenimiento.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMantenimientoDto extends PartialType(CreateMantenimientoDto) {
  @IsString()
  @IsNotEmpty()
  usuarioModificacion: string;
}