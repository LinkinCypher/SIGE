import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsuarioPermiso, UsuarioPermisoDocument } from '../entities/usuario-permiso.entity';
import { AsignarPermisoDto } from '../dto/asignar-permiso.dto';
import { AsignarMultiplesPermisosDto } from '../dto/asignar-multiples-permisos.dto';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { PermisosService } from '../../permisos/services/permisos.service';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Injectable()
export class UsuarioPermisosService {
  constructor(
    @InjectModel(UsuarioPermiso.name) private usuarioPermisoModel: Model<UsuarioPermisoDocument>,
    private usuariosService: UsuariosService,
    private permisosService: PermisosService,
  ) {}

  async asignarPermiso(asignarPermisoDto: AsignarPermisoDto): Promise<UsuarioPermiso> {
    // Verificar que el usuario existe
    await this.verificarUsuario(asignarPermisoDto.usuarioId);
    
    // Verificar que el permiso existe
    await this.verificarPermiso(asignarPermisoDto.permisoId);

    // Convertir IDs a ObjectId si son strings
    const usuarioId = typeof asignarPermisoDto.usuarioId === 'string' 
      ? new Types.ObjectId(asignarPermisoDto.usuarioId) 
      : asignarPermisoDto.usuarioId;

    const permisoId = typeof asignarPermisoDto.permisoId === 'string' 
      ? new Types.ObjectId(asignarPermisoDto.permisoId) 
      : asignarPermisoDto.permisoId;

    // Verificar si el permiso ya está asignado
    const existente = await this.usuarioPermisoModel.findOne({
      usuarioId,
      permisoId
    }).exec();

    if (existente) {
      throw new ConflictException('Este permiso ya está asignado al usuario');
    }

    // Crear la asignación
    const nuevaAsignacion = new this.usuarioPermisoModel({
      usuarioId,
      permisoId,
      asignadoPor: asignarPermisoDto.asignadoPor,
      fechaAsignacion: new Date()
    });

    return nuevaAsignacion.save();
  }

  async asignarMultiplesPermisos(asignarDto: AsignarMultiplesPermisosDto): Promise<UsuarioPermiso[]> {
    // Verificar que el usuario existe
    await this.verificarUsuario(asignarDto.usuarioId);
    
    const usuarioId = typeof asignarDto.usuarioId === 'string' 
      ? new Types.ObjectId(asignarDto.usuarioId) 
      : asignarDto.usuarioId;

    // Verificar y convertir todos los IDs de permisos
    const permisoIds = await Promise.all(
      asignarDto.permisoIds.map(async (id) => {
        await this.verificarPermiso(id);
        return typeof id === 'string' ? new Types.ObjectId(id) : id;
      })
    );

    // Obtener permisos ya asignados
    const permisosExistentes = await this.usuarioPermisoModel.find({
      usuarioId,
      permisoId: { $in: permisoIds }
    }).exec();

    const permisosExistentesIds = permisosExistentes.map(p => p.permisoId.toString());
    
    // Filtrar solo los permisos que no están ya asignados
    const nuevosPermisoIds = permisoIds.filter(
      id => !permisosExistentesIds.includes(id.toString())
    );

    if (nuevosPermisoIds.length === 0) {
      throw new ConflictException('Todos los permisos ya están asignados a este usuario');
    }

    // Crear documentos para las nuevas asignaciones
    const nuevasAsignaciones = nuevosPermisoIds.map(permisoId => ({
      usuarioId,
      permisoId,
      asignadoPor: asignarDto.asignadoPor,
      fechaAsignacion: new Date()
    }));

    // Insertar todas las nuevas asignaciones
    const resultados = await this.usuarioPermisoModel.insertMany(nuevasAsignaciones);
    // Usar cast para resolver el problema de tipos
    return resultados as unknown as UsuarioPermiso[];
  }

  async revocarPermiso(usuarioId: string | Types.ObjectId, permisoId: string | Types.ObjectId): Promise<void> {
    // Convertir IDs a ObjectId si son strings
    const uId = typeof usuarioId === 'string' ? new Types.ObjectId(usuarioId) : usuarioId;
    const pId = typeof permisoId === 'string' ? new Types.ObjectId(permisoId) : permisoId;

    const resultado = await this.usuarioPermisoModel.deleteOne({
      usuarioId: uId,
      permisoId: pId
    }).exec();

    if (resultado.deletedCount === 0) {
      throw new NotFoundException('No se encontró el permiso asignado al usuario');
    }
  }

  async revocarTodosLosPermisos(usuarioId: string | Types.ObjectId): Promise<void> {
    // Convertir ID a ObjectId si es string
    const uId = typeof usuarioId === 'string' ? new Types.ObjectId(usuarioId) : usuarioId;

    const resultado = await this.usuarioPermisoModel.deleteMany({
      usuarioId: uId
    }).exec();

    if (resultado.deletedCount === 0) {
      throw new NotFoundException('No se encontraron permisos asignados a este usuario');
    }
  }

  async getPermisosDeUsuario(usuarioId: string | Types.ObjectId): Promise<Permiso[]> {
    // Verificar que el usuario existe
    await this.verificarUsuario(usuarioId);

    // Convertir ID a ObjectId si es string
    const uId = typeof usuarioId === 'string' ? new Types.ObjectId(usuarioId) : usuarioId;

    // Obtener las asignaciones del usuario
    const asignaciones = await this.usuarioPermisoModel.find({
      usuarioId: uId
    }).exec();

    if (asignaciones.length === 0) {
      return []; // El usuario no tiene permisos asignados
    }

    // Extraer los IDs de permisos
    const permisoIds = asignaciones.map(a => a.permisoId);

    // Obtener los permisos completos
    return this.permisosService.findByIds(permisoIds);
  }

  async tienePermiso(
    usuarioId: string | Types.ObjectId, 
    codigoPermiso: string
  ): Promise<boolean> {
    try {
      // Verificar que el usuario existe
      await this.verificarUsuario(usuarioId);

      // Buscar el permiso por código
      const permiso = await this.permisosService.findByCode(codigoPermiso);

      // Convertir IDs a ObjectId
      const uId = typeof usuarioId === 'string' ? new Types.ObjectId(usuarioId) : usuarioId;
      // Acceder al id de manera segura
      const pId = permiso['_id']; // Usar notación de corchetes para evitar el error de TypeScript

      // Verificar si tiene la asignación
      const tieneAsignacion = await this.usuarioPermisoModel.exists({
      usuarioId: uId,
      permisoId: pId
      }).exec();

      return tieneAsignacion !== null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false; // Si el usuario o el permiso no existen, no tiene el permiso
      }
      throw error; // Propagar otros errores
    }
  }

  // Método auxiliar para verificar si un usuario existe
  private async verificarUsuario(usuarioId: string | Types.ObjectId): Promise<void> {
    try {
      await this.usuariosService.findOne(usuarioId.toString());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`El usuario con ID "${usuarioId}" no existe`);
      }
      throw error;
    }
  }

  // Método auxiliar para verificar si un permiso existe
  private async verificarPermiso(permisoId: string | Types.ObjectId): Promise<void> {
    try {
      await this.permisosService.findOne(permisoId.toString());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`El permiso con ID "${permisoId}" no existe`);
      }
      throw error;
    }
  }
}