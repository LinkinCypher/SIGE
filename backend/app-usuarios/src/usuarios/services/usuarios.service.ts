import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioDocument } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioModel.findOne({ 
      username: createUsuarioDto.username 
    }).exec();
    
    if (usuarioExistente) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

    // Crear nuevo usuario con la contraseña hasheada
    const nuevoUsuario = new this.usuarioModel({
      ...createUsuarioDto,
      password: hashedPassword,
    });

    return nuevoUsuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
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
    // Si viene password en el DTO, hasheamos la nueva contraseña
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt();
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }

    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
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
}