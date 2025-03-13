import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permiso, PermisoDocument } from '../entities/permiso.entity';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { UpdatePermisoDto } from '../dto/update-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectModel(Permiso.name) private permisoModel: Model<PermisoDocument>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    // Verificar si ya existe un permiso con el mismo código
    const permisoExistente = await this.permisoModel.findOne({ 
      codigo: createPermisoDto.codigo 
    }).exec();
    
    if (permisoExistente) {
      throw new ConflictException(`Ya existe un permiso con el código "${createPermisoDto.codigo}"`);
    }

    const nuevoPermiso = new this.permisoModel(createPermisoDto);
    return nuevoPermiso.save();
  }

  async findAll(activo?: boolean): Promise<Permiso[]> {
    const filter = activo !== undefined ? { activo } : {};
    return this.permisoModel.find(filter).sort({ codigo: 1 }).exec();
  }

  async findOne(id: string): Promise<Permiso> {
    const permiso = await this.permisoModel.findById(id).exec();
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }
    return permiso;
  }

  async findByCode(codigo: string): Promise<Permiso> {
    const permiso = await this.permisoModel.findOne({ codigo }).exec();
    if (!permiso) {
      throw new NotFoundException(`Permiso con código "${codigo}" no encontrado`);
    }
    return permiso;
  }

  async findByIds(ids: any[]): Promise<Permiso[]> {
    return this.permisoModel.find({
      _id: { $in: ids },
      activo: true
    }).sort({ codigo: 1 }).exec();
  }

  async update(id: string, updatePermisoDto: UpdatePermisoDto): Promise<Permiso> {
    // Si se está actualizando el código, verificar que no exista otro permiso con ese código
    if (updatePermisoDto.codigo) {
      const existente = await this.permisoModel.findOne({
        _id: { $ne: id },
        codigo: updatePermisoDto.codigo
      }).exec();
      
      if (existente) {
        throw new ConflictException(`Ya existe otro permiso con el código "${updatePermisoDto.codigo}"`);
      }
    }

    const permisoActualizado = await this.permisoModel
      .findByIdAndUpdate(
        id, 
        {
          ...updatePermisoDto,
          fechaActualizacion: new Date()
        }, 
        { new: true }
      )
      .exec();

    if (!permisoActualizado) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }

    return permisoActualizado;
  }

  async remove(id: string): Promise<void> {
    const resultado = await this.permisoModel.deleteOne({ _id: id }).exec();
    
    if (resultado.deletedCount === 0) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }
  }

  async toggleActive(id: string, activo: boolean): Promise<Permiso> {
    const permisoActualizado = await this.permisoModel
      .findByIdAndUpdate(
        id, 
        { 
          activo, 
          fechaActualizacion: new Date() 
        }, 
        { new: true }
      )
      .exec();

    if (!permisoActualizado) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }

    return permisoActualizado;
  }
}