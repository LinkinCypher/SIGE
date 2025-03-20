import { IsNotEmpty, IsString, IsMongoId, IsDate, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HistorialItemDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha: Date;
  
  @IsString()
  @IsNotEmpty()
  estado: string;
  
  @IsString()
  @IsOptional()
  descripcion?: string;
  
  @IsMongoId()
  @IsNotEmpty()
  usuarioId: string;
  
  @IsString()
  @IsNotEmpty()
  usuarioNombre: string;
}

export class CreateSeguroDto {
  @IsMongoId()
  @IsNotEmpty()
  equipo: string;

  @IsString()
  @IsOptional()
  aseguradora?: string;

  @IsString()
  @IsOptional()
  numeroPoliza?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaInicio?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaFin?: Date;

  @IsNumber()
  @IsOptional()
  valorAsegurado?: number;

  @ValidateNested({ each: true })
  @Type(() => HistorialItemDto)
  @IsNotEmpty()
  historialItem: HistorialItemDto;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}