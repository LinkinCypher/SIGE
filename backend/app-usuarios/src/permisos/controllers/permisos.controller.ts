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
    HttpCode 
  } from '@nestjs/common';
  import { PermisosService } from '../services/permisos.service';
  import { CreatePermisoDto } from '../dto/create-permiso.dto';
  import { UpdatePermisoDto } from '../dto/update-permiso.dto';
  
  @Controller('permisos')
  export class PermisosController {
    constructor(private readonly permisosService: PermisosService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPermisoDto: CreatePermisoDto) {
      return this.permisosService.create(createPermisoDto);
    }
  
    @Get()
    findAll(@Query('activo') activo?: string) {
      // Convertir el parámetro de consulta a booleano si está presente
      const activoFilter = activo !== undefined 
        ? activo === 'true' 
        : undefined;
      
      return this.permisosService.findAll(activoFilter);
    }
  
    @Get('codigo/:codigo')
    findByCode(@Param('codigo') codigo: string) {
      return this.permisosService.findByCode(codigo);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.permisosService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermisoDto: UpdatePermisoDto) {
      return this.permisosService.update(id, updatePermisoDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.permisosService.remove(id);
    }
  
    @Patch(':id/activar')
    activar(@Param('id') id: string) {
      return this.permisosService.toggleActive(id, true);
    }
  
    @Patch(':id/desactivar')
    desactivar(@Param('id') id: string) {
      return this.permisosService.toggleActive(id, false);
    }
  }