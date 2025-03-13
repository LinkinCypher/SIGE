import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { UsuarioPermisosService } from '../../usuario-permisos/services/usuario-permisos.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private usuarioPermisosService: UsuarioPermisosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usuariosService.findByUsername(username);
      
      // Verificar si el usuario está activo
      if (!user.activo) {
        throw new UnauthorizedException('Usuario inactivo');
      }
      
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        // Usar destructuring directamente sin llamar a toObject()
        const { password, ...result } = user as any;
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar el último acceso
    await this.usuariosService.updateLastAccess(user._id);

    // Obtener los códigos de permisos del usuario
    const permisos = await this.usuarioPermisosService.getPermisosDeUsuario(user._id);
    const codigosPermisos = permisos.map(p => p.codigo);

    // Crear el payload del token JWT
    const payload = { 
      username: user.username, 
      sub: user._id,
      role: user.role,
      permisos: codigosPermisos
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
        permisos: codigosPermisos
      }
    };
  }
}