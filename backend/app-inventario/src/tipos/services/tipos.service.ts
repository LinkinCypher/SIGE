import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tipo, TipoDocument } from '../entities/tipo.entity';
import { CreateTipoDto } from '../dto/create-tipo.dto';
import { UpdateTipoDto } from '../dto/update-tipo.dto';

@Injectable()
export class TiposService {
  constructor(
    @InjectModel(Tipo.name) private tipoModel: Model<TipoDocument>,
  ) {}

  async create(createTipoDto: CreateTipoDto): Promise<Tipo> {
    const { usuarioCreacion, ...tipoData } = createTipoDto;
    
    const nuevoTipo = new this.tipoModel({
      ...tipoData,
      creado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
      modificado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
    });
    
    return nuevoTipo.save();
  }

  async findAll(): Promise<Tipo[]> {
    return this.tipoModel.find({ activo: true }).exec();
  }

  async findOne(id: string): Promise<Tipo> {
    const tipo = await this.tipoModel.findById(id).exec();
    if (!tipo) {
      throw new NotFoundException(`Tipo de equipo con ID "${id}" no encontrado`);
    }
    return tipo;
  }

  async update(id: string, updateTipoDto: UpdateTipoDto): Promise<Tipo> {
    const { usuarioModificacion, ...tipoData } = updateTipoDto;
    
    const tipoActualizado = await this.tipoModel.findByIdAndUpdate(
      id,
      {
        ...tipoData,
        modificado: {
          usuario: usuarioModificacion,
          fecha: new Date(),
        },
      },
      { new: true },
    ).exec();
    
    if (!tipoActualizado) {
      throw new NotFoundException(`Tipo de equipo con ID "${id}" no encontrado`);
    }
    
    return tipoActualizado;
  }

  async remove(id: string, usuarioEliminacion: string): Promise<Tipo> {
    // Eliminado lógico (desactivar)
    const tipoEliminado = await this.tipoModel.findByIdAndUpdate(
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
    
    if (!tipoEliminado) {
      throw new NotFoundException(`Tipo de equipo con ID "${id}" no encontrado`);
    }
    
    return tipoEliminado;
  }
}