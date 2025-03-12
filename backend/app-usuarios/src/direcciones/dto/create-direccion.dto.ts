
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDireccionDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @IsNotEmpty({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'El código solo puede contener letras, números, guiones y guiones bajos' 
  })
  codigo: string;
}