import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Delete, 
    HttpStatus, 
    HttpCode, 
    Query
  } from '@nestjs/common';
  import { UsuarioPermisosService } from '../services/usuario-permisos.service';
  import { AsignarPermisoDto } from '../dto/asignar-permiso.dto';
  import { AsignarMultiplesPermisosDto } from '../dto/asignar-multiples-permisos.dto';
  
  @Controller('usuario-permisos')
  export class UsuarioPermisosController {
    constructor(private readonly usuarioPermisosService: UsuarioPermisosService) {}
  
    @Post('asignar')
    @HttpCode(HttpStatus.CREATED)
    asignarPermiso(@Body() asignarPermisoDto: AsignarPermisoDto) {
      return this.usuarioPermisosService.asignarPermiso(asignarPermisoDto);
    }
  
    @Post('asignar-multiples')
    @HttpCode(HttpStatus.CREATED)
    asignarMultiplesPermisos(@Body() asignarMultiplesPermisosDto: AsignarMultiplesPermisosDto) {
      return this.usuarioPermisosService.asignarMultiplesPermisos(asignarMultiplesPermisosDto);
    }
  
    @Delete(':usuarioId/permiso/:permisoId')
    @HttpCode(HttpStatus.NO_CONTENT)
    revocarPermiso(
      @Param('usuarioId') usuarioId: string,
      @Param('permisoId') permisoId: string
    ) {
      return this.usuarioPermisosService.revocarPermiso(usuarioId, permisoId);
    }
  
    @Delete(':usuarioId/todos')
    @HttpCode(HttpStatus.NO_CONTENT)
    revocarTodosLosPermisos(@Param('usuarioId') usuarioId: string) {
      return this.usuarioPermisosService.revocarTodosLosPermisos(usuarioId);
    }
  
    @Get(':usuarioId/permisos')
    getPermisosDeUsuario(@Param('usuarioId') usuarioId: string) {
      return this.usuarioPermisosService.getPermisosDeUsuario(usuarioId);
    }
  
    @Get(':usuarioId/verificar-permiso')
    async tienePermiso(
      @Param('usuarioId') usuarioId: string,
      @Query('codigo') codigoPermiso: string
    ) {
      const resultado = await this.usuarioPermisosService.tienePermiso(usuarioId, codigoPermiso);
      return { tienePermiso: resultado };
    }
  }