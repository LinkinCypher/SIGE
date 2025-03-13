import { PartialType } from '@nestjs/mapped-types';
import { CreatePaginaDto } from './create-pagina.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePaginaDto extends PartialType(CreatePaginaDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}