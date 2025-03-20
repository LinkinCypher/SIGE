import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SegurosService } from '../services/seguros.service';
import { CreateSeguroDto } from '../dto/create-seguro.dto';
import { UpdateSeguroDto } from '../dto/update-seguro.dto';

@Controller('seguros')
export class SegurosController {
  constructor(private readonly segurosService: SegurosService) {}

  @Post()
  create(@Body() createSeguroDto: CreateSeguroDto) {
    return this.segurosService.create(createSeguroDto);
  }

  @Get()
  findAll() {
    return this.segurosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.segurosService.findOne(id);
  }

  @Get('equipo/:equipoId')
  findByEquipo(@Param('equipoId') equipoId: string) {
    return this.segurosService.findByEquipo(equipoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeguroDto: UpdateSeguroDto) {
    return this.segurosService.update(id, updateSeguroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.segurosService.remove(id);
  }
}