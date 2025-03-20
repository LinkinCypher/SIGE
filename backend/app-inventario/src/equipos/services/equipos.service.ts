import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipo, EquipoDocument } from '../entities/equipo.entity';
import { CreateEquipoDto } from '../dto/create-equipo.dto';
import { UpdateEquipoDto } from '../dto/update-equipo.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectModel(Equipo.name) private equipoModel: Model<EquipoDocument>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    const { usuarioCreacion, ...equipoData } = createEquipoDto;
    
    const nuevoEquipo = new this.equipoModel({
      ...equipoData,
      creado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
      modificado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
    });
    
    return nuevoEquipo.save();
  }

  async findAll(): Promise<Equipo[]> {
    return this.equipoModel.find({ activo: true })
      .populate('tipo', 'nombre')
      .populate('marca', 'nombre')
      .exec();
  }

  async findOne(id: string): Promise<Equipo> {
    const equipo = await this.equipoModel.findById(id)
      .populate('tipo', 'nombre')
      .populate('marca', 'nombre')
      .exec();
      
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID "${id}" no encontrado`);
    }
    return equipo;
  }

  async update(id: string, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    const { usuarioModificacion, ...equipoData } = updateEquipoDto;
    
    const equipoActualizado = await this.equipoModel.findByIdAndUpdate(
      id,
      {
        ...equipoData,
        modificado: {
          usuario: usuarioModificacion,
          fecha: new Date(),
        },
      },
      { new: true },
    )
    .populate('tipo', 'nombre')
    .populate('marca', 'nombre')
    .exec();
    
    if (!equipoActualizado) {
      throw new NotFoundException(`Equipo con ID "${id}" no encontrado`);
    }
    
    return equipoActualizado;
  }

  async remove(id: string, usuarioEliminacion: string): Promise<Equipo> {
    // Eliminado lógico (desactivar)
    const equipoEliminado = await this.equipoModel.findByIdAndUpdate(
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
    
    if (!equipoEliminado) {
      throw new NotFoundException(`Equipo con ID "${id}" no encontrado`);
    }
    
    return equipoEliminado;
  }

  async buscarPorCodigo(codigo: string): Promise<Equipo> {
    const equipo = await this.equipoModel.findOne({ codigo, activo: true })
      .populate('tipo', 'nombre')
      .populate('marca', 'nombre')
      .exec();
      
    if (!equipo) {
      throw new NotFoundException(`Equipo con código "${codigo}" no encontrado`);
    }
    return equipo;
  }
}