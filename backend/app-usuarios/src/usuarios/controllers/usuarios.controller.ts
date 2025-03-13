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
    // Opcionalmente, podemos usar el usuario autenticado para el campo asignadoPor
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
}