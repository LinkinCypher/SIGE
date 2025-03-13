import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode, 
  Query,
  UseGuards
} from '@nestjs/common';
import { UsuarioPermisosService } from '../services/usuario-permisos.service';
import { AsignarPermisoDto } from '../dto/asignar-permiso.dto';
import { AsignarMultiplesPermisosDto } from '../dto/asignar-multiples-permisos.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermisosGuard } from '../../auth/guards/permisos.guard';
import { RequierePermiso } from '../../auth/decorators/requiere-permiso.decorator';

@Controller('usuario-permisos')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
export class UsuarioPermisosController {
  constructor(private readonly usuarioPermisosService: UsuarioPermisosService) {}

  @Post('asignar')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.asignar')
  @HttpCode(HttpStatus.CREATED)
  asignarPermiso(@Body() asignarPermisoDto: AsignarPermisoDto) {
    return this.usuarioPermisosService.asignarPermiso(asignarPermisoDto);
  }

  @Post('asignar-multiples')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.asignar')
  @HttpCode(HttpStatus.CREATED)
  asignarMultiplesPermisos(@Body() asignarMultiplesPermisosDto: AsignarMultiplesPermisosDto) {
    return this.usuarioPermisosService.asignarMultiplesPermisos(asignarMultiplesPermisosDto);
  }

  @Delete(':usuarioId/permiso/:permisoId')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.revocar')
  @HttpCode(HttpStatus.NO_CONTENT)
  revocarPermiso(
    @Param('usuarioId') usuarioId: string,
    @Param('permisoId') permisoId: string
  ) {
    return this.usuarioPermisosService.revocarPermiso(usuarioId, permisoId);
  }

  @Delete(':usuarioId/todos')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.revocar')
  @HttpCode(HttpStatus.NO_CONTENT)
  revocarTodosLosPermisos(@Param('usuarioId') usuarioId: string) {
    return this.usuarioPermisosService.revocarTodosLosPermisos(usuarioId);
  }

  @Get(':usuarioId/permisos')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.ver')
  getPermisosDeUsuario(@Param('usuarioId') usuarioId: string) {
    return this.usuarioPermisosService.getPermisosDeUsuario(usuarioId);
  }

  @Get(':usuarioId/verificar-permiso')
  @UseGuards(PermisosGuard)
  @RequierePermiso('permisos.ver')
  async tienePermiso(
    @Param('usuarioId') usuarioId: string,
    @Query('codigo') codigoPermiso: string
  ) {
    const resultado = await this.usuarioPermisosService.tienePermiso(usuarioId, codigoPermiso);
    return { tienePermiso: resultado };
  }
}