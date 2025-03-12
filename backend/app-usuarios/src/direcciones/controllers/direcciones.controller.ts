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
  import { DireccionesService } from '../services/direcciones.service';
  import { CreateDireccionDto } from '../dto/create-direccion.dto';
  import { UpdateDireccionDto } from '../dto/update-direccion.dto';
  
  @Controller('direcciones')
  export class DireccionesController {
    constructor(private readonly direccionesService: DireccionesService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createDireccionDto: CreateDireccionDto) {
      return this.direccionesService.create(createDireccionDto);
    }
  
    @Get()
    findAll(@Query('activo') activo?: string) {
      // Convertir el parámetro de consulta a booleano si está presente
      const activoFilter = activo !== undefined 
        ? activo === 'true' 
        : undefined;
      
      return this.direccionesService.findAll(activoFilter);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.direccionesService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDireccionDto: UpdateDireccionDto) {
      return this.direccionesService.update(id, updateDireccionDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.direccionesService.remove(id);
    }
  
    @Patch(':id/activar')
    activar(@Param('id') id: string) {
      return this.direccionesService.toggleActive(id, true);
    }
  
    @Patch(':id/desactivar')
    desactivar(@Param('id') id: string) {
      return this.direccionesService.toggleActive(id, false);
    }
  }