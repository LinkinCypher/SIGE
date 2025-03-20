import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Equipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private apiUrl = `${environment.URL_API_INVENTARIO}/equipos`;

  constructor(private http: HttpClient) { }

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  getEquipo(id: string): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}/${id}`);
  }

  getEquipoPorCodigo(codigo: string): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}/codigo/${codigo}`);
  }

  crearEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.apiUrl, equipo);
  }

  actualizarEquipo(id: string, equipo: Equipo): Observable<Equipo> {
    return this.http.patch<Equipo>(`${this.apiUrl}/${id}`, equipo);
  }

  eliminarEquipo(id: string, usuario: string): Observable<Equipo> {
    return this.http.delete<Equipo>(`${this.apiUrl}/${id}?usuario=${usuario}`);
  }
}