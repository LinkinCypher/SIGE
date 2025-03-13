import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePermisoDto {
  @IsNotEmpty({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Matches(/^[a-z]+\.[a-z]+$/, { 
    message: 'El código debe tener el formato "modulo.accion" (ej: "usuarios.ver")' 
  })
  codigo: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;
}