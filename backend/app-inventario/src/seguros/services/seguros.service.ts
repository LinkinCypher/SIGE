import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seguro, SeguroDocument } from '../entities/seguro.entity';
import { CreateSeguroDto } from '../dto/create-seguro.dto';
import { UpdateSeguroDto } from '../dto/update-seguro.dto';

@Injectable()
export class SegurosService {
  constructor(
    @InjectModel(Seguro.name) private seguroModel: Model<SeguroDocument>,
  ) {}

  async create(createSeguroDto: CreateSeguroDto): Promise<Seguro> {
    const { 
      usuarioCreacion, 
      historialItem,
      ...seguroData 
    } = createSeguroDto;
    
    // Crear el primer item de historial
    const historialInicial = {
      fecha: historialItem.fecha || new Date(),
      estado: historialItem.estado,
      descripcion: historialItem.descripcion || '',
      usuario: {
        id: historialItem.usuarioId,
        nombre: historialItem.usuarioNombre
      }
    };
    
    const nuevoSeguro = new this.seguroModel({
      ...seguroData,
      historial: [historialInicial],
      creado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
      modificado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
    });
    
    return nuevoSeguro.save();
  }

  async findAll(): Promise<Seguro[]> {
    return this.seguroModel.find()
      .populate('equipo', 'codigo modelo serie')
      .sort({ 'modificado.fecha': -1 })
      .exec();
  }

  async findOne(id: string): Promise<Seguro> {
    const seguro = await this.seguroModel.findById(id)
      .populate('equipo', 'codigo modelo serie tipo marca')
      .exec();
      
    if (!seguro) {
      throw new NotFoundException(`Seguro con ID "${id}" no encontrado`);
    }
    return seguro;
  }

  async findByEquipo(equipoId: string): Promise<Seguro> {
    const seguro = await this.seguroModel.findOne({ equipo: equipoId })
      .populate('equipo', 'codigo modelo serie tipo marca')
      .exec();
      
    if (!seguro) {
      throw new NotFoundException(`Seguro para el equipo con ID "${equipoId}" no encontrado`);
    }
    return seguro;
  }

  async update(id: string, updateSeguroDto: UpdateSeguroDto): Promise<Seguro> {
    const { 
      usuarioModificacion, 
      nuevoHistorialItem,
      ...seguroData 
    } = updateSeguroDto;
    
    // Preparamos los datos para la actualización
    const updateData: any = {
      ...seguroData,
      modificado: {
        usuario: usuarioModificacion,
        fecha: new Date(),
      },
    };

    // Si hay un nuevo item de historial, lo añadimos
    if (nuevoHistorialItem) {
      const seguro = await this.seguroModel.findById(id).exec();
      if (!seguro) {
        throw new NotFoundException(`Seguro con ID "${id}" no encontrado`);
      }
      
      // Crear el nuevo item de historial
      const nuevoItem = {
        fecha: new Date(),
        estado: nuevoHistorialItem.estado,
        descripcion: nuevoHistorialItem.descripcion || '',
        usuario: {
          id: nuevoHistorialItem.usuarioId,
          nombre: nuevoHistorialItem.usuarioNombre
        }
      };
      
      // Añadir el nuevo item al historial existente
      updateData.$push = { historial: nuevoItem };
    }
    
    const seguroActualizado = await this.seguroModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    )
    .populate('equipo', 'codigo modelo serie')
    .exec();
    
    if (!seguroActualizado) {
      throw new NotFoundException(`Seguro con ID "${id}" no encontrado`);
    }
    
    return seguroActualizado;
  }

  async remove(id: string): Promise<Seguro> {
    const seguroEliminado = await this.seguroModel.findByIdAndDelete(id).exec();
    
    if (!seguroEliminado) {
      throw new NotFoundException(`Seguro con ID "${id}" no encontrado`);
    }
    
    return seguroEliminado;
  }
}