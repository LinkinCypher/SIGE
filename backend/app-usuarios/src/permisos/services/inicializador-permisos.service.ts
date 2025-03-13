import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permiso, PermisoDocument } from '../entities/permiso.entity';
import { TodosLosPermisos } from '../../catalogos';

@Injectable()
export class InicializadorPermisosService implements OnModuleInit {
  private readonly logger = new Logger('InicializadorPermisosService');

  constructor(
    @InjectModel(Permiso.name) private permisoModel: Model<PermisoDocument>,
  ) {}

  async onModuleInit() {
    await this.inicializarPermisos();
  }

  private async inicializarPermisos() {
    // Verificar cuáles permisos ya existen
    const permisosExistentes = await this.permisoModel.find({
      codigo: { $in: TodosLosPermisos.map(p => p.codigo) }
    }).exec();

    const codigosExistentes = permisosExistentes.map(p => p.codigo);
    
    // Filtrar solo los permisos que no existen aún
    const permisosNuevos = TodosLosPermisos.filter(
      p => !codigosExistentes.includes(p.codigo)
    );

    if (permisosNuevos.length > 0) {
      await this.permisoModel.insertMany(permisosNuevos);
      this.logger.log(`Se han creado ${permisosNuevos.length} permisos básicos`);
    } else {
      this.logger.log('Todos los permisos básicos ya existen');
    }
  }
}