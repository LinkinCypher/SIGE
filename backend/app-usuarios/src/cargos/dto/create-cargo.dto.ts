import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCargoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsMongoId({ message: 'El ID de dirección debe ser un ObjectId válido' })
  direccionId: Types.ObjectId | string;
}