import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TiposService } from '../services/tipos.service';
import { CreateTipoDto } from '../dto/create-tipo.dto';
import { UpdateTipoDto } from '../dto/update-tipo.dto';

@Controller('tipos')
export class TiposController {
  constructor(private readonly tiposService: TiposService) {}

  @Post()
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.tiposService.create(createTipoDto);
  }

  @Get()
  findAll(@Query('incluirInactivos') incluirInactivos?: string) {
    const mostrarInactivos = incluirInactivos === 'true';
    return this.tiposService.findAll(mostrarInactivos);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoDto: UpdateTipoDto) {
    return this.tiposService.update(id, updateTipoDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('usuario') usuario: string,
  ) {
    return this.tiposService.remove(id, usuario);
  }

  @Patch(':id/reactivar')
  reactivar(@Param('id') id: string, @Body() data: { usuarioModificacion: string }) {
    return this.tiposService.reactivar(id, data.usuarioModificacion);
  }
}