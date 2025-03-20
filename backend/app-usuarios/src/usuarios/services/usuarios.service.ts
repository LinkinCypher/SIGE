import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { DireccionesService } from '../../direcciones/services/direcciones.service';
import { CargosService } from '../../cargos/services/cargos.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private direccionesService: DireccionesService,
    private cargosService: CargosService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioModel.findOne({ 
      username: createUsuarioDto.username 
    }).exec();
    
    if (usuarioExistente) {
      throw new ConflictException('El nombre de usuario ya existe');
    }
  
    // Verificar que la dirección existe
    await this.verificarDireccion(createUsuarioDto.direccionId);
  
    // Verificar que el cargo existe y pertenece a la dirección
    await this.verificarCargo(createUsuarioDto.cargoId, createUsuarioDto.direccionId);
  
    // Preparar los datos para crear el nuevo usuario
    const userData: any = { ...createUsuarioDto };
  
    // Convertir IDs a ObjectId si son strings
    if (typeof createUsuarioDto.direccionId === 'string') {
      userData.direccionId = new Types.ObjectId(createUsuarioDto.direccionId);
    }
    if (typeof createUsuarioDto.cargoId === 'string') {
      userData.cargoId = new Types.ObjectId(createUsuarioDto.cargoId);
    }
  
    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(createUsuarioDto.password, salt);
    
    // Convertir fechaNacimiento a Date
    userData.fechaNacimiento = new Date(createUsuarioDto.fechaNacimiento);
  
    // Asignar permisos si existen en el DTO, sino dejar vacío
    userData.permisos = createUsuarioDto.permisos || [];
  
    // Crear nuevo usuario con los datos preparados
    const nuevoUsuario = new this.usuarioModel(userData);
    return nuevoUsuario.save();
  }
  

  async findAll(activo?: boolean, direccionId?: string, cargoId?: string): Promise<Usuario[]> {
    const filter: any = {};
    
    if (activo !== undefined) {
      filter.activo = activo;
    }
    
    if (direccionId) {
      filter.direccionId = new Types.ObjectId(direccionId);
    }
    
    if (cargoId) {
      filter.cargoId = new Types.ObjectId(cargoId);
    }
    
    return this.usuarioModel.find(filter)
      .sort({ apellido: 1, nombre: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
    return usuario;
  }

  async findByUsername(username: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findOne({ username }).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario "${username}" no encontrado`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // Verificar relaciones si están presentes en el DTO
    if (updateUsuarioDto.direccionId) {
      await this.verificarDireccion(updateUsuarioDto.direccionId);
    }
    
    if (updateUsuarioDto.cargoId && updateUsuarioDto.direccionId) {
      await this.verificarCargo(updateUsuarioDto.cargoId, updateUsuarioDto.direccionId);
    } else if (updateUsuarioDto.cargoId) {
      // Si solo se actualiza el cargo, necesitamos la dirección actual
      const usuario = await this.findOne(id);
      await this.verificarCargo(updateUsuarioDto.cargoId, usuario.direccionId.toString());
    }
  
    // Crear objeto de actualización en lugar de modificar el DTO directamente
    const updateData: any = { ...updateUsuarioDto };
  
    // Convertir IDs a ObjectId si son strings
    if (updateUsuarioDto.direccionId && typeof updateUsuarioDto.direccionId === 'string') {
      updateData.direccionId = new Types.ObjectId(updateUsuarioDto.direccionId);
    }
    if (updateUsuarioDto.cargoId && typeof updateUsuarioDto.cargoId === 'string') {
      updateData.cargoId = new Types.ObjectId(updateUsuarioDto.cargoId);
    }
  
    // Si viene password en el DTO, hasheamos la nueva contraseña
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }
  
    // Si viene fechaNacimiento, convertir a Date
    if (updateUsuarioDto.fechaNacimiento) {
      updateData.fechaNacimiento = new Date(updateUsuarioDto.fechaNacimiento);
    }
  
    // Si vienen permisos, los actualizamos
    if (updateUsuarioDto.permisos !== undefined) {
      updateData.permisos = updateUsuarioDto.permisos;
    }
  
    // Añadir fecha de actualización
    updateData.fechaActualizacion = new Date();
  
    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  
    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
  
    return usuarioActualizado;
  }  

  async remove(id: string): Promise<void> {
    const resultado = await this.usuarioModel.deleteOne({ _id: id }).exec();
    
    if (resultado.deletedCount === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
  }

  async toggleActive(id: string, activo: boolean): Promise<Usuario> {
    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(
        id, 
        { 
          activo, 
          fechaActualizacion: new Date() 
        }, 
        { new: true }
      )
      .exec();

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    return usuarioActualizado;
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

  // Método para verificar si existe un cargo y pertenece a la dirección
  private async verificarCargo(
    cargoId: string | Types.ObjectId, 
    direccionId: string | Types.ObjectId
  ): Promise<void> {
    try {
      const cargo = await this.cargosService.findOne(cargoId.toString());
      
      // Verificar que el cargo pertenece a la dirección
      if (cargo.direccionId.toString() !== direccionId.toString()) {
        throw new BadRequestException(
          `El cargo con ID "${cargoId}" no pertenece a la dirección con ID "${direccionId}"`
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`El cargo con ID "${cargoId}" no existe`);
      }
      throw error;
    }
  }

  async updateLastAccess(id: string): Promise<void> {
    await this.usuarioModel.findByIdAndUpdate(
      id,
      { 
        ultimoAcceso: new Date(),
        fechaActualizacion: new Date()
      }
    ).exec();
  }
}