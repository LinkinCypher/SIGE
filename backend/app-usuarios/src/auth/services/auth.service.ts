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
  
      if (!user) {
        console.log('Usuario no encontrado:', username);
        return null;
      }
  
      if (!user.activo) {
        console.log('Usuario inactivo:', username);
        throw new UnauthorizedException('Usuario inactivo');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Contraseña incorrecta para:', username);
        return null;
      }
  
      const userObject = user as any;
      userObject._id = userObject._id?.toString() || ''; // Convertir a string si existe
  
      console.log('Usuario validado correctamente:', username);
      return userObject;
    } catch (error) {
      console.error('Error en validateUser:', error);
      return null;
    }
  }
  

  
  async login(loginDto: LoginDto) {
    console.log('Intentando login con:', loginDto.username);

    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      console.log('Autenticación fallida para:', loginDto.username);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('Usuario autenticado:', loginDto.username);

    // Actualizar el último acceso
    if (user._id) {
      await this.usuariosService.updateLastAccess(user._id);
    } else {
      console.error('Error: _id del usuario es undefined');
      throw new UnauthorizedException('No se pudo obtener el ID del usuario');
    }

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