import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Direccion {
  _id?: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {
  private apiUrl = `${environment.apiUrl}/direcciones`;

  constructor(private http: HttpClient) { }

  getDirecciones(activo: boolean = true): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.apiUrl}?activo=${activo}`);
  }

  getDireccion(id: string): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/${id}`);
  }

  crearDireccion(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(this.apiUrl, direccion);
  }

  actualizarDireccion(id: string, direccion: Direccion): Observable<Direccion> {
    return this.http.patch<Direccion>(`${this.apiUrl}/${id}`, direccion);
  }

  eliminarDireccion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activarDireccion(id: string): Observable<Direccion> {
    return this.http.patch<Direccion>(`${this.apiUrl}/${id}/activar`, {});
  }

  desactivarDireccion(id: string): Observable<Direccion> {
    return this.http.patch<Direccion>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}