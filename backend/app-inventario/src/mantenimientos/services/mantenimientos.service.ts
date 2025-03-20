import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mantenimiento, MantenimientoDocument } from '../entities/mantenimiento.entity';
import { CreateMantenimientoDto } from '../dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from '../dto/update-mantenimiento.dto';

@Injectable()
export class MantenimientosService {
  constructor(
    @InjectModel(Mantenimiento.name) private mantenimientoModel: Model<MantenimientoDocument>,
  ) {}

  async create(createMantenimientoDto: CreateMantenimientoDto): Promise<Mantenimiento> {
    const { 
      usuarioCreacion, 
      tecnicoId, 
      tecnicoNombre,
      ...mantenimientoData 
    } = createMantenimientoDto;
    
    const nuevoMantenimiento = new this.mantenimientoModel({
      ...mantenimientoData,
      tecnico: {
        id: tecnicoId,
        nombre: tecnicoNombre
      },
      creado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
      modificado: {
        usuario: usuarioCreacion,
        fecha: new Date(),
      },
    });
    
    return nuevoMantenimiento.save();
  }

  async findAll(): Promise<Mantenimiento[]> {
    return this.mantenimientoModel.find()
      .populate('equipo', 'codigo modelo serie')
      .sort({ fecha: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Mantenimiento> {
    const mantenimiento = await this.mantenimientoModel.findById(id)
      .populate('equipo', 'codigo modelo serie tipo marca')
      .exec();
      
    if (!mantenimiento) {
      throw new NotFoundException(`Mantenimiento con ID "${id}" no encontrado`);
    }
    return mantenimiento;
  }

  async findByEquipo(equipoId: string): Promise<Mantenimiento[]> {
    return this.mantenimientoModel.find({ equipo: equipoId })
      .sort({ fecha: -1 })
      .exec();
  }

  async update(id: string, updateMantenimientoDto: UpdateMantenimientoDto): Promise<Mantenimiento> {
    const { 
      usuarioModificacion, 
      tecnicoId, 
      tecnicoNombre, 
      ...mantenimientoData 
    } = updateMantenimientoDto;
    
    // Preparamos los datos para la actualización
    const updateData: any = {
      ...mantenimientoData,
      modificado: {
        usuario: usuarioModificacion,
        fecha: new Date(),
      },
    };

    // Si se proporcionan datos del técnico, actualizamos
    if (tecnicoId && tecnicoNombre) {
      updateData.tecnico = {
        id: tecnicoId,
        nombre: tecnicoNombre
      };
    }
    
    const mantenimientoActualizado = await this.mantenimientoModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    )
    .populate('equipo', 'codigo modelo serie')
    .exec();
    
    if (!mantenimientoActualizado) {
      throw new NotFoundException(`Mantenimiento con ID "${id}" no encontrado`);
    }
    
    return mantenimientoActualizado;
  }

  async remove(id: string): Promise<Mantenimiento> {
    const mantenimientoEliminado = await this.mantenimientoModel.findByIdAndDelete(id).exec();
    
    if (!mantenimientoEliminado) {
      throw new NotFoundException(`Mantenimiento con ID "${id}" no encontrado`);
    }
    
    return mantenimientoEliminado;
  }
}