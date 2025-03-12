import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direccion, DireccionDocument } from '../entities/direccion.entity';
import { CreateDireccionDto } from '../dto/create-direccion.dto';
import { UpdateDireccionDto } from '../dto/update-direccion.dto';

@Injectable()
export class DireccionesService {
  constructor(
    @InjectModel(Direccion.name) private direccionModel: Model<DireccionDocument>,
  ) {}

  async create(createDireccionDto: CreateDireccionDto): Promise<Direccion> {
    // Verificar si ya existe una dirección con el mismo nombre o código
    const direccionExistente = await this.direccionModel.findOne({
      $or: [
        { nombre: createDireccionDto.nombre },
        { codigo: createDireccionDto.codigo }
      ]
    }).exec();
    
    if (direccionExistente) {
      throw new ConflictException(
        direccionExistente.nombre === createDireccionDto.nombre
          ? 'Ya existe una dirección con este nombre'
          : 'Ya existe una dirección con este código'
      );
    }

    const nuevaDireccion = new this.direccionModel(createDireccionDto);
    return nuevaDireccion.save();
  }

  async findAll(activo?: boolean): Promise<Direccion[]> {
    const filter = activo !== undefined ? { activo } : {};
    return this.direccionModel.find(filter).sort({ nombre: 1 }).exec();
  }

  async findOne(id: string): Promise<Direccion> {
    const direccion = await this.direccionModel.findById(id).exec();
    if (!direccion) {
      throw new NotFoundException(`Dirección con ID "${id}" no encontrada`);
    }
    return direccion;
  }

  async update(id: string, updateDireccionDto: UpdateDireccionDto): Promise<Direccion> {
    // Si se está actualizando nombre o código, verificar que no existan ya
    if (updateDireccionDto.nombre || updateDireccionDto.codigo) {
      const conditions: any[] = []; // Definición explícita del tipo
      
      if (updateDireccionDto.nombre) {
        conditions.push({ nombre: updateDireccionDto.nombre });
      }
      
      if (updateDireccionDto.codigo) {
        conditions.push({ codigo: updateDireccionDto.codigo });
      }
      
      if (conditions.length > 0) {
        const existente = await this.direccionModel.findOne({
          $and: [
            { _id: { $ne: id } },
            { $or: conditions }
          ]
        }).exec();
        
        if (existente) {
          throw new ConflictException(
            existente.nombre === updateDireccionDto.nombre
              ? 'Ya existe otra dirección con este nombre'
              : 'Ya existe otra dirección con este código'
          );
        }
      }
    }

    // En lugar de modificar el DTO, incluimos la fecha en el objeto de actualización
    const direccionActualizada = await this.direccionModel
      .findByIdAndUpdate(
        id, 
        {
          ...updateDireccionDto,
          fechaActualizacion: new Date()
        }, 
        { new: true }
      )
      .exec();

    if (!direccionActualizada) {
      throw new NotFoundException(`Dirección con ID "${id}" no encontrada`);
    }

    return direccionActualizada;
  }

  async remove(id: string): Promise<void> {
    // Este método implementa el borrado físico
    const resultado = await this.direccionModel.deleteOne({ _id: id }).exec();
    
    if (resultado.deletedCount === 0) {
      throw new NotFoundException(`Dirección con ID "${id}" no encontrada`);
    }
  }

  async toggleActive(id: string, activo: boolean): Promise<Direccion> {
    // Este método implementa activación/desactivación (borrado lógico)
    const direccionActualizada = await this.direccionModel
      .findByIdAndUpdate(
        id, 
        { 
          activo, 
          fechaActualizacion: new Date() 
        }, 
        { new: true }
      )
      .exec();

    if (!direccionActualizada) {
      throw new NotFoundException(`Dirección con ID "${id}" no encontrada`);
    }

    return direccionActualizada;
  }
}