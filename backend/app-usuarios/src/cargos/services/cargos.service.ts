import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cargo, CargoDocument } from '../entities/cargo.entity';
import { CreateCargoDto } from '../dto/create-cargo.dto';
import { UpdateCargoDto } from '../dto/update-cargo.dto';
import { DireccionesService } from '../../direcciones/services/direcciones.service';

@Injectable()
export class CargosService {
  constructor(
    @InjectModel(Cargo.name) private cargoModel: Model<CargoDocument>,
    private direccionesService: DireccionesService,
  ) {}

  async create(createCargoDto: CreateCargoDto): Promise<Cargo> {
    // Verificar que la dirección existe
    await this.verificarDireccion(createCargoDto.direccionId);

    // Convertir direccionId a ObjectId si es un string
    if (typeof createCargoDto.direccionId === 'string') {
      createCargoDto.direccionId = new Types.ObjectId(createCargoDto.direccionId);
    }

    // Verificar si ya existe un cargo con el mismo nombre en la misma dirección
    const cargoExistente = await this.cargoModel.findOne({
      nombre: createCargoDto.nombre,
      direccionId: createCargoDto.direccionId
    }).exec();
    
    if (cargoExistente) {
      throw new ConflictException('Ya existe un cargo con este nombre en la dirección especificada');
    }

    const nuevoCargo = new this.cargoModel(createCargoDto);
    return nuevoCargo.save();
  }

  async findAll(activo?: boolean, direccionId?: string): Promise<Cargo[]> {
    // Construir filtro basado en los parámetros opcionales
    const filter: any = {};
    
    if (activo !== undefined) {
      filter.activo = activo;
    }
    
    if (direccionId) {
      filter.direccionId = new Types.ObjectId(direccionId);
      // Verificar que la dirección existe
      await this.verificarDireccion(direccionId);
    }
    
    return this.cargoModel.find(filter)
      .sort({ nombre: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Cargo> {
    const cargo = await this.cargoModel.findById(id).exec();
    if (!cargo) {
      throw new NotFoundException(`Cargo con ID "${id}" no encontrado`);
    }
    return cargo;
  }

  async update(id: string, updateCargoDto: UpdateCargoDto): Promise<Cargo> {
    // Si se está actualizando la dirección, verificar que exista
    if (updateCargoDto.direccionId) {
      await this.verificarDireccion(updateCargoDto.direccionId);
      
      // Convertir a ObjectId si es un string
      if (typeof updateCargoDto.direccionId === 'string') {
        updateCargoDto.direccionId = new Types.ObjectId(updateCargoDto.direccionId);
      }
    }

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre en la misma dirección
    if (updateCargoDto.nombre) {
      const cargo = await this.cargoModel.findById(id).exec();
      if (!cargo) {
        throw new NotFoundException(`Cargo con ID "${id}" no encontrado`);
      }
      
      const direccionId = updateCargoDto.direccionId || cargo.direccionId;
      
      const existente = await this.cargoModel.findOne({
        _id: { $ne: id },
        nombre: updateCargoDto.nombre,
        direccionId: direccionId
      }).exec();
      
      if (existente) {
        throw new ConflictException('Ya existe otro cargo con este nombre en la dirección especificada');
      }
    }

    const cargoActualizado = await this.cargoModel
      .findByIdAndUpdate(
        id, 
        {
          ...updateCargoDto,
          fechaActualizacion: new Date()
        }, 
        { new: true }
      )
      .exec();

    if (!cargoActualizado) {
      throw new NotFoundException(`Cargo con ID "${id}" no encontrado`);
    }

    return cargoActualizado;
  }

  async remove(id: string): Promise<void> {
    const resultado = await this.cargoModel.deleteOne({ _id: id }).exec();
    
    if (resultado.deletedCount === 0) {
      throw new NotFoundException(`Cargo con ID "${id}" no encontrado`);
    }
  }

  async toggleActive(id: string, activo: boolean): Promise<Cargo> {
    const cargoActualizado = await this.cargoModel
      .findByIdAndUpdate(
        id, 
        { 
          activo, 
          fechaActualizacion: new Date() 
        }, 
        { new: true }
      )
      .exec();

    if (!cargoActualizado) {
      throw new NotFoundException(`Cargo con ID "${id}" no encontrado`);
    }

    return cargoActualizado;
  }

  // Método para verificar si existe una dirección
  private async verificarDireccion(direccionId: string | Types.ObjectId): Promise<void> {
    try {
      await this.direccionesService.findOne(direccionId.toString());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`La dirección con ID "${direccionId}" no existe`);
      }
      throw error;
    }
  }
}