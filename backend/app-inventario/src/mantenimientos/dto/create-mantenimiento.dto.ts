import { IsNotEmpty, IsString, IsMongoId, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMantenimientoDto {
  @IsMongoId()
  @IsNotEmpty()
  equipo: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha: Date;

  @IsString()
  @IsOptional()
  memoriaRam?: string;

  @IsString()
  @IsOptional()
  discoDuro?: string;

  @IsString()
  @IsOptional()
  procesador?: string;

  @IsString()
  @IsOptional()
  sistemaOperativo?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsMongoId()
  @IsNotEmpty()
  tecnicoId: string;

  @IsString()
  @IsNotEmpty()
  tecnicoNombre: string;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}