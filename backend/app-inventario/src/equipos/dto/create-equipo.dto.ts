import { IsNotEmpty, IsString, IsMongoId, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEquipoDto {
  @IsMongoId()
  @IsNotEmpty()
  tipo: string;

  @IsMongoId()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  serie: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaAdquisicion: Date;

  @IsString()
  @IsNotEmpty()
  usuarioCreacion: string;
}