import { IsNotEmpty, IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CampoEspecificoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsBoolean()
  requerido: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  opciones?: string[];
}

export class CreateTipoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CampoEspecificoDto)
  @IsOptional()
  camposEspecificos?: CampoEspecificoDto[];

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}