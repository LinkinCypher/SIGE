import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermiso = this.reflector.get<string>('permiso', context.getHandler());
    
    if (!requiredPermiso) {
      return true; // Si no se requiere un permiso específico, permitir acceso
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    
    const tienePermiso = user.permisos && 
                        Array.isArray(user.permisos) && 
                        user.permisos.includes(requiredPermiso);
    
    if (!tienePermiso) {
      throw new ForbiddenException(`Acceso denegado: Se requiere el permiso "${requiredPermiso}"`);
    }
    
    return true;
  }
}