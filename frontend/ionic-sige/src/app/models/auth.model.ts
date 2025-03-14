import { Usuario } from './usuario.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}

export interface UserPermissions {
  permisos: string[];
  usuario: string;
}