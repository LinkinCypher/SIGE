import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePaginaDto {
  @IsNotEmpty({ message: 'El código es requerido' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Matches(/^[a-z]+(\.[a-z]+)+$/, { 
    message: 'El código debe tener el formato "modulo.submodulo[.accion]" (ej: "usuarios.lista")' 
  })
  codigo: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @IsNotEmpty({ message: 'La ruta es requerida' })
  @IsString({ message: 'La ruta debe ser una cadena de texto' })
  ruta: string;

  @IsOptional()
  @IsString({ message: 'El icono debe ser una cadena de texto' })
  icono: string;

  @IsOptional()
  @IsMongoId({ message: 'El ID del módulo padre debe ser un ObjectId válido' })
  moduloPadreId?: Types.ObjectId | string;

  @IsNotEmpty({ message: 'El ID del permiso es requerido' })
  @IsMongoId({ message: 'El ID del permiso debe ser un ObjectId válido' })
  permisoId: Types.ObjectId | string;

  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  orden?: number;
  
  @IsOptional()
  @IsBoolean({ message: 'El campo esModulo debe ser un valor booleano' })
  esModulo?: boolean;
}