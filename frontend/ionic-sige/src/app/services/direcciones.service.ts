import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Direccion {
  _id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  activo: boolean;
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
}