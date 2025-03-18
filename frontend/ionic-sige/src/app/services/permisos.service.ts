import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Permiso {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl = `${environment.apiUrl}/permisos`;
  private usuarioPermisosUrl = `${environment.apiUrl}/usuario-permisos`;

  constructor(private http: HttpClient) { }

  getPermisos(activo: boolean = true): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}?activo=${activo}`);
  }

  getPermisosDeUsuario(usuarioId: string): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.usuarioPermisosUrl}/${usuarioId}/permisos`);
  }

  asignarPermiso(usuarioId: string, permisoId: string): Observable<any> {
    return this.http.post(`${this.usuarioPermisosUrl}/asignar`, {
      usuarioId,
      permisoId
    });
  }

  asignarMultiplesPermisos(usuarioId: string, permisoIds: string[]): Observable<any> {
    return this.http.post(`${this.usuarioPermisosUrl}/asignar-multiples`, {
      usuarioId,
      permisoIds
    });
  }

  revocarPermiso(usuarioId: string, permisoId: string): Observable<any> {
    return this.http.delete(`${this.usuarioPermisosUrl}/${usuarioId}/permiso/${permisoId}`);
  }

  revocarTodosLosPermisos(usuarioId: string): Observable<any> {
    return this.http.delete(`${this.usuarioPermisosUrl}/${usuarioId}/todos`);
  }

  activarPermiso(id: string): Observable<Permiso> {
    return this.http.patch<Permiso>(`${this.apiUrl}/${id}/activar`, {});
  }
  
  desactivarPermiso(id: string): Observable<Permiso> {
    return this.http.patch<Permiso>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}