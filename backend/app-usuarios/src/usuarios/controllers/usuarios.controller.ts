import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpStatus, 
  HttpCode,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermisosGuard } from '../../auth/guards/permisos.guard';
import { RequierePermiso } from '../../auth/decorators/requiere-permiso.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.crear')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.ver')
  findAll(
    @Query('activo') activo?: string,
    @Query('direccionId') direccionId?: string,
    @Query('cargoId') cargoId?: string
  ) {
    const activoFilter = activo !== undefined 
      ? activo === 'true' 
      : undefined;
    
    return this.usuariosService.findAll(activoFilter, direccionId, cargoId);
  }

  @Get(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.ver')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.editar')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.eliminar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @Patch(':id/activar')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.editar')
  activar(@Param('id') id: string) {
    return this.usuariosService.toggleActive(id, true);
  }

  @Patch(':id/desactivar')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.editar')
  desactivar(@Param('id') id: string) {
    return this.usuariosService.toggleActive(id, false);
  }

  // 🔹 NUEVOS ENDPOINTS PARA GESTIONAR PERMISOS 🔹

  @Get(':id/permisos')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.ver')
  findPermisos(@Param('id') id: string) {
    return this.usuariosService.findOne(id).then(usuario => usuario.permisos);
  }

  @Patch(':id/permisos/asignar')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.asignar')
  async asignarPermisos(@Param('id') id: string, @Body() body: { permisos: string[] }) {
    const usuario = await this.usuariosService.findOne(id);
    const nuevosPermisos = [...new Set([...usuario.permisos, ...body.permisos])]; // Evita duplicados
    return this.usuariosService.update(id, { permisos: nuevosPermisos });
  }

  @Patch(':id/permisos/revocar')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.asignar')
  async revocarPermisos(@Param('id') id: string, @Body() body: { permisos: string[] }) {
    const usuario = await this.usuariosService.findOne(id);
    const permisosActualizados = usuario.permisos.filter(p => !body.permisos.includes(p));
    return this.usuariosService.update(id, { permisos: permisosActualizados });
  }
}
