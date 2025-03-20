import { 
  IsDateString, 
  IsEmail, 
  IsMongoId, 
  IsNotEmpty, 
  IsOptional, 
  IsPhoneNumber, 
  IsString, 
  MinLength,
  IsArray
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  apellido: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsMongoId({ message: 'El ID de dirección debe ser un ObjectId válido' })
  direccionId: Types.ObjectId | string;

  @IsNotEmpty({ message: 'El cargo es requerido' })
  @IsMongoId({ message: 'El ID de cargo debe ser un ObjectId válido' })
  cargoId: Types.ObjectId | string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
  @IsDateString({}, { message: 'Formato de fecha inválido' })
  fechaNacimiento: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de email inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @IsOptional()
  @IsArray({ message: 'Los permisos deben ser un array de cadenas' })
  @IsString({ each: true, message: 'Cada permiso debe ser una cadena de texto' })
  permisos?: string[];
}
