// src/app/services/tipos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tipo } from '../models/tipo.model';

@Injectable({
  providedIn: 'root'
})
export class TiposService {
  private apiUrl = `${environment.URL_API_INVENTARIO}/tipos`;

  constructor(private http: HttpClient) { }

  getTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.apiUrl}?incluirInactivos=true`);
  }

  getTipo(id: string): Observable<Tipo> {
    return this.http.get<Tipo>(`${this.apiUrl}/${id}`);
  }

  crearTipo(tipo: Tipo): Observable<Tipo> {
    console.log('Datos enviados a la API:', tipo);
    return this.http.post<Tipo>(this.apiUrl, tipo);
  }

  actualizarTipo(id: string, tipo: any): Observable<Tipo> {
    return this.http.patch<Tipo>(`${this.apiUrl}/${id}`, tipo);
  }

  eliminarTipo(id: string, usuario: string): Observable<Tipo> {
    return this.http.delete<Tipo>(`${this.apiUrl}/${id}?usuario=${usuario}`);
  }

  reactivarTipo(id: string, usuario: string): Observable<Tipo> {
    return this.http.patch<Tipo>(`${this.apiUrl}/${id}/reactivar`, { usuarioModificacion: usuario });
  }
}