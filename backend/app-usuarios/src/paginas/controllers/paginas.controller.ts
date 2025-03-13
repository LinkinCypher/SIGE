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
    UseGuards 
  } from '@nestjs/common';
  import { PaginasService } from '../services/paginas.service';
  import { CreatePaginaDto } from '../dto/create-pagina.dto';
  import { UpdatePaginaDto } from '../dto/update-pagina.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { PermisosGuard } from '../../auth/guards/permisos.guard';
  import { RequierePermiso } from '../../auth/decorators/requiere-permiso.decorator';
  
  @Controller('paginas')
  @UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
  export class PaginasController {
    constructor(private readonly paginasService: PaginasService) {}
  
    @Post()
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.crear')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPaginaDto: CreatePaginaDto) {
      return this.paginasService.create(createPaginaDto);
    }
  
    @Get()
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    findAll(
      @Query('activo') activo?: string,
      @Query('esModulo') esModulo?: string
    ) {
      const activoFilter = activo !== undefined ? activo === 'true' : undefined;
      const esModuloFilter = esModulo !== undefined ? esModulo === 'true' : undefined;
      
      return this.paginasService.findAll(activoFilter, esModuloFilter);
    }
  
    @Get('arbol')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    getArbolPaginas() {
      return this.paginasService.getArbolPaginas();
    }
  
    @Get('modulo/:moduloPadreId')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    findByModuloPadre(@Param('moduloPadreId') moduloPadreId: string) {
      return this.paginasService.findByModuloPadre(moduloPadreId);
    }
  
    @Get('nivel-superior')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    findNivelSuperior() {
      return this.paginasService.findByModuloPadre(null);
    }
  
    @Get('permiso/:permisoId')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    findByPermiso(@Param('permisoId') permisoId: string) {
      return this.paginasService.findByPermiso(permisoId);
    }
  
    @Get(':id')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.ver')
    findOne(@Param('id') id: string) {
      return this.paginasService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.editar')
    update(@Param('id') id: string, @Body() updatePaginaDto: UpdatePaginaDto) {
      return this.paginasService.update(id, updatePaginaDto);
    }
  
    @Delete(':id')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.eliminar')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.paginasService.remove(id);
    }
  
    @Patch(':id/activar')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.editar')
    activar(@Param('id') id: string) {
      return this.paginasService.toggleActive(id, true);
    }
  
    @Patch(':id/desactivar')
    @UseGuards(PermisosGuard)
    @RequierePermiso('paginas.editar')
    desactivar(@Param('id') id: string) {
      return this.paginasService.toggleActive(id, false);
    }
  }