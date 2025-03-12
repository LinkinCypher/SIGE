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
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll(
    @Query('activo') activo?: string,
    @Query('direccionId') direccionId?: string,
    @Query('cargoId') cargoId?: string
  ) {
    // Convertir el parámetro de consulta a booleano si está presente
    const activoFilter = activo !== undefined 
      ? activo === 'true' 
      : undefined;
    
    return this.usuariosService.findAll(activoFilter, direccionId, cargoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuariosService.toggleActive(id, true);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id') id: string) {
    return this.usuariosService.toggleActive(id, false);
  }
}