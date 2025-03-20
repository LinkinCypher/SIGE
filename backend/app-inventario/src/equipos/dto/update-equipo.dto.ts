import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {
  @IsString()
  @IsNotEmpty()
  usuarioModificacion: string;
}