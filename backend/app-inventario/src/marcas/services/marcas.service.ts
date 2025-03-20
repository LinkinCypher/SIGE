import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marca, MarcaDocument } from '../entities/marca.entity';
import { CreateMarcaDto } from '../dto/create-marca.dto';
import { UpdateMarcaDto } from '../dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectModel(Marca.name) private marcaModel: Model<MarcaDocument>,
  ) {}

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    const { usuarioCreacion, ...marcaData } = createMarcaDto;
    
    const nuevaMarca = new this.marcaModel({
      ...marcaData,
      creado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
      modificado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
    });
    
    return nuevaMarca.save();
  }

  async findAll(): Promise<Marca[]> {
    return this.marcaModel.find({ activo: true }).exec();
  }

  async findOne(id: string): Promise<Marca> {
    const marca = await this.marcaModel.findById(id).exec();
    if (!marca) {
      throw new NotFoundException(`Marca con ID "${id}" no encontrada`);
    }
    return marca;
  }

  async update(id: string, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const { usuarioModificacion, ...marcaData } = updateMarcaDto;
    
    const marcaActualizada = await this.marcaModel.findByIdAndUpdate(
      id,
      {
        ...marcaData,
        modificado: {
          usuario: usuarioModificacion,
          fecha: new Date(),
        },
      },
      { new: true },
    ).exec();
    
    if (!marcaActualizada) {
      throw new NotFoundException(`Marca con ID "${id}" no encontrada`);
    }
    
    return marcaActualizada;
  }

  async remove(id: string, usuarioEliminacion: string): Promise<Marca> {
    // Eliminado lógico (desactivar)
    const marcaEliminada = await this.marcaModel.findByIdAndUpdate(
      id,
      {
        activo: false,
        modificado: {
          usuario: usuarioEliminacion,
          fecha: new Date(),
        },
      },
      { new: true },
    ).exec();
    
    if (!marcaEliminada) {
      throw new NotFoundException(`Marca con ID "${id}" no encontrada`);
    }
    
    return marcaEliminada;
  }
}