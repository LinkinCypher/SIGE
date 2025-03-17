import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarios(activo: boolean = true, direccionId?: string, cargoId?: string): Observable<Usuario[]> {
    let url = `${this.apiUrl}?`;
    
    if (activo !== undefined) {
      url += `activo=${activo}&`;
    }
    
    if (direccionId) {
      url += `direccionId=${direccionId}&`;
    }
    
    if (cargoId) {
      url += `cargoId=${cargoId}&`;
    }
    
    // Eliminar el último "&" o "?" si existe
    url = url.endsWith('&') ? url.slice(0, -1) : url;
    url = url.endsWith('?') ? url.slice(0, -1) : url;
    
    return this.http.get<Usuario[]>(url);
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: string, usuario: any): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/activar`, {});
  }

  desactivarUsuario(id: string): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}