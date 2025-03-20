import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {
  @IsString()
  @IsNotEmpty()
  usuarioModificacion: string;
}