import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pagina, PaginaDocument } from '../entities/pagina.entity';
import { CreatePaginaDto } from '../dto/create-pagina.dto';
import { UpdatePaginaDto } from '../dto/update-pagina.dto';
import { PermisosService } from '../../permisos/services/permisos.service';

@Injectable()
export class PaginasService {
  constructor(
    @InjectModel(Pagina.name) private paginaModel: Model<PaginaDocument>,
    private permisosService: PermisosService,
  ) {}

  async create(createPaginaDto: CreatePaginaDto): Promise<Pagina> {
    // Verificar si ya existe una página con el mismo código o ruta
    const paginaExistente = await this.paginaModel.findOne({
      $or: [
        { codigo: createPaginaDto.codigo },
        { ruta: createPaginaDto.ruta }
      ]
    }).exec();
    
    if (paginaExistente) {
      throw new ConflictException(
        paginaExistente.codigo === createPaginaDto.codigo
          ? `Ya existe una página con el código "${createPaginaDto.codigo}"`
          : `Ya existe una página con la ruta "${createPaginaDto.ruta}"`
      );
    }

    // Verificar que el permiso existe
    await this.verificarPermiso(createPaginaDto.permisoId);

    // Verificar que el módulo padre existe (si se especifica)
    if (createPaginaDto.moduloPadreId) {
      await this.verificarModuloPadre(createPaginaDto.moduloPadreId);
    }

    // Convertir IDs a ObjectId si son strings
    const paginaData: any = { ...createPaginaDto };
    
    if (typeof createPaginaDto.permisoId === 'string') {
      paginaData.permisoId = new Types.ObjectId(createPaginaDto.permisoId);
    }
    
    if (createPaginaDto.moduloPadreId && typeof createPaginaDto.moduloPadreId === 'string') {
      paginaData.moduloPadreId = new Types.ObjectId(createPaginaDto.moduloPadreId);
    }

    const nuevaPagina = new this.paginaModel(paginaData);
    return nuevaPagina.save();
  }

  async findAll(activo?: boolean, esModulo?: boolean): Promise<Pagina[]> {
    const filter: any = {};
    
    if (activo !== undefined) {
      filter.activo = activo;
    }
    
    if (esModulo !== undefined) {
      filter.esModulo = esModulo;
    }
    
    return this.paginaModel.find(filter)
      .sort({ esModulo: -1, orden: 1, nombre: 1 })
      .populate('permisoId', 'codigo nombre')
      .exec();
  }

  async findOne(id: string): Promise<Pagina> {
    const pagina = await this.paginaModel.findById(id)
      .populate('permisoId', 'codigo nombre')
      .exec();
      
    if (!pagina) {
      throw new NotFoundException(`Página con ID "${id}" no encontrada`);
    }
    
    return pagina;
  }

  async findByPermiso(permisoId: string): Promise<Pagina[]> {
    const permId = new Types.ObjectId(permisoId);
    return this.paginaModel.find({ permisoId: permId, activo: true })
      .sort({ orden: 1, nombre: 1 })
      .exec();
  }

  async findByModuloPadre(moduloPadreId: string | null): Promise<Pagina[]> {
    // null busca páginas/módulos de nivel superior (sin padre)
    const filter = moduloPadreId 
      ? { moduloPadreId: new Types.ObjectId(moduloPadreId), activo: true }
      : { moduloPadreId: null, activo: true };
      
    return this.paginaModel.find(filter)
      .sort({ esModulo: -1, orden: 1, nombre: 1 })
      .populate('permisoId', 'codigo nombre')
      .exec();
  }

  async getArbolPaginas(): Promise<any[]> {
    // Obtener todos los módulos y páginas activos
    const todas = await this.paginaModel.find({ activo: true })
      .sort({ esModulo: -1, orden: 1, nombre: 1 })
      .populate('permisoId', 'codigo nombre')
      .lean()
      .exec();
      
    // Función recursiva para construir el árbol
    const construirArbol = (moduloPadreId: string | null = null) => {
      return todas
        .filter(pagina => {
          // Convertir ObjectId a string para comparación o verificar si es null/undefined
          const paginaPadreId = pagina.moduloPadreId ? pagina.moduloPadreId.toString() : null;
          return (paginaPadreId === moduloPadreId) || 
                (moduloPadreId === null && !pagina.moduloPadreId);
        })
        .map(pagina => {
          // Si es un módulo, buscar sus hijos
          if (pagina.esModulo) {
            return {
              ...pagina,
              hijos: construirArbol(pagina._id.toString())
            };
          }
          return pagina;
        });
    };
    
    // Construir árbol desde el nivel superior
    return construirArbol();
  }

  async update(id: string, updatePaginaDto: UpdatePaginaDto): Promise<Pagina> {
    // Si se está actualizando código o ruta, verificar que no existan duplicados
    if (updatePaginaDto.codigo || updatePaginaDto.ruta) {
      const conditions: any[] = []; // Definir explícitamente como array de any
      
      if (updatePaginaDto.codigo) {
        conditions.push({ codigo: updatePaginaDto.codigo });
      }
      
      if (updatePaginaDto.ruta) {
        conditions.push({ ruta: updatePaginaDto.ruta });
      }
      
      if (conditions.length > 0) {
        const existente = await this.paginaModel.findOne({
          $and: [
            { _id: { $ne: id } },
            { $or: conditions }
          ]
        }).exec();
        
        if (existente) {
          throw new ConflictException(
            existente.codigo === updatePaginaDto.codigo
              ? `Ya existe otra página con el código "${updatePaginaDto.codigo}"`
              : `Ya existe otra página con la ruta "${updatePaginaDto.ruta}"`
          );
        }
      }
    }

    // Verificar relaciones
    if (updatePaginaDto.permisoId) {
      await this.verificarPermiso(updatePaginaDto.permisoId);
    }
    
    if (updatePaginaDto.moduloPadreId) {
      // Verificar que no se esté asignando a sí mismo como padre
      if (updatePaginaDto.moduloPadreId === id) {
        throw new BadRequestException('Una página no puede ser su propio módulo padre');
      }
      await this.verificarModuloPadre(updatePaginaDto.moduloPadreId);
    }

    // Preparar datos para actualización
    const updateData: any = { ...updatePaginaDto };
    
    // Convertir IDs a ObjectId si son strings
    if (updatePaginaDto.permisoId && typeof updatePaginaDto.permisoId === 'string') {
      updateData.permisoId = new Types.ObjectId(updatePaginaDto.permisoId);
    }
    
    if (updatePaginaDto.moduloPadreId && typeof updatePaginaDto.moduloPadreId === 'string') {
      updateData.moduloPadreId = new Types.ObjectId(updatePaginaDto.moduloPadreId);
    }

    // Actualizar fecha
    updateData.fechaActualizacion = new Date();

    const paginaActualizada = await this.paginaModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!paginaActualizada) {
      throw new NotFoundException(`Página con ID "${id}" no encontrada`);
    }

    return paginaActualizada;
  }

  async remove(id: string): Promise<void> {
    // Verificar si hay páginas que dependen de esta como módulo padre
    const tieneHijos = await this.paginaModel.exists({ moduloPadreId: id }).exec();
    
    if (tieneHijos) {
      throw new BadRequestException('No se puede eliminar porque hay páginas que dependen de este módulo');
    }
    
    const resultado = await this.paginaModel.deleteOne({ _id: id }).exec();
    
    if (resultado.deletedCount === 0) {
      throw new NotFoundException(`Página con ID "${id}" no encontrada`);
    }
  }

  async toggleActive(id: string, activo: boolean): Promise<Pagina> {
    const paginaActualizada = await this.paginaModel
      .findByIdAndUpdate(
        id, 
        { 
          activo, 
          fechaActualizacion: new Date() 
        }, 
        { new: true }
      )
      .exec();

    if (!paginaActualizada) {
      throw new NotFoundException(`Página con ID "${id}" no encontrada`);
    }

    return paginaActualizada;
  }

  // Métodos auxiliares para verificación
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

  private async verificarModuloPadre(moduloPadreId: string | Types.ObjectId): Promise<void> {
    try {
      const moduloPadre = await this.paginaModel.findById(moduloPadreId).exec();
      
      if (!moduloPadre) {
        throw new NotFoundException(`El módulo padre con ID "${moduloPadreId}" no existe`);
      }
      
      if (!moduloPadre.esModulo) {
        throw new BadRequestException(`La página con ID "${moduloPadreId}" no es un módulo y no puede contener otras páginas`);
      }
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`El módulo padre con ID "${moduloPadreId}" no existe`);
      }
      throw error;
    }
  }
}