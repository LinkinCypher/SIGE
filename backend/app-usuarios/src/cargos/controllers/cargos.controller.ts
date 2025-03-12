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
  import { CargosService } from '../services/cargos.service';
  import { CreateCargoDto } from '../dto/create-cargo.dto';
  import { UpdateCargoDto } from '../dto/update-cargo.dto';
  
  @Controller('cargos')
  export class CargosController {
    constructor(private readonly cargosService: CargosService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCargoDto: CreateCargoDto) {
      return this.cargosService.create(createCargoDto);
    }
  
    @Get()
    findAll(
      @Query('activo') activo?: string,
      @Query('direccionId') direccionId?: string
    ) {
      // Convertir el parámetro de consulta a booleano si está presente
      const activoFilter = activo !== undefined 
        ? activo === 'true' 
        : undefined;
      
      return this.cargosService.findAll(activoFilter, direccionId);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.cargosService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
      return this.cargosService.update(id, updateCargoDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.cargosService.remove(id);
    }
  
    @Patch(':id/activar')
    activar(@Param('id') id: string) {
      return this.cargosService.toggleActive(id, true);
    }
  
    @Patch(':id/desactivar')
    desactivar(@Param('id') id: string) {
      return this.cargosService.toggleActive(id, false);
    }
  }