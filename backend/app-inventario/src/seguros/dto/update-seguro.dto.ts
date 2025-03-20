import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSeguroDto } from './create-seguro.dto';

class HistorialItemDto {
  @IsString()
  @IsNotEmpty()
  estado: string;
  
  @IsString()
  @IsOptional()
  descripcion?: string;
  
  @IsString()
  @IsNotEmpty()
  usuarioId: string;
  
  @IsString()
  @IsNotEmpty()
  usuarioNombre: string;
}

export class UpdateSeguroDto extends PartialType(CreateSeguroDto) {
  @IsString()
  @IsNotEmpty()
  usuarioModificacion: string;

  @ValidateNested()
  @Type(() => HistorialItemDto)
  @IsOptional()
  nuevoHistorialItem?: HistorialItemDto;
}