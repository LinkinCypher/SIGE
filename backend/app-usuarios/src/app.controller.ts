import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RequierePermiso } from './auth/decorators/requiere-permiso.decorator';
import { PermisosGuard } from './auth/guards/permisos.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Ruta protegida - solo accesible con token JWT
  @UseGuards(JwtAuthGuard)
  @Get('privado')
  getPrivateData(@Request() req) {
    return {
      message: 'Esta es información privada',
      user: req.user
    };
  }

  // Ruta protegida - solo accesible con el permiso específico
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('usuarios.admin')
  @Get('solo-admin')
  getAdminData() {
    return {
      message: 'Esta es información solo para administradores',
    };
  }
}