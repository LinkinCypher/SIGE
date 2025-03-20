import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Seguro } from '../models/seguro.model';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {
  private apiUrl = `${environment.URL_API_INVENTARIO}/seguros`;

  constructor(private http: HttpClient) { }

  getSeguros(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(this.apiUrl);
  }

  getSeguro(id: string): Observable<Seguro> {
    return this.http.get<Seguro>(`${this.apiUrl}/${id}`);
  }

  getSeguroPorEquipo(equipoId: string): Observable<Seguro> {
    return this.http.get<Seguro>(`${this.apiUrl}/equipo/${equipoId}`);
  }

  crearSeguro(seguro: Seguro): Observable<Seguro> {
    return this.http.post<Seguro>(this.apiUrl, seguro);
  }

  actualizarSeguro(id: string, seguro: Seguro): Observable<Seguro> {
    return this.http.patch<Seguro>(`${this.apiUrl}/${id}`, seguro);
  }

  eliminarSeguro(id: string): Observable<Seguro> {
    return this.http.delete<Seguro>(`${this.apiUrl}/${id}`);
  }
}