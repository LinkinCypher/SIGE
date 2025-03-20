import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mantenimiento } from '../models/mantenimiento.model';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  private apiUrl = `${environment.URL_API_INVENTARIO}/mantenimientos`;

  constructor(private http: HttpClient) { }

  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  getMantenimiento(id: string): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}/${id}`);
  }

  getMantenimientosPorEquipo(equipoId: string): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}/equipo/${equipoId}`);
  }

  crearMantenimiento(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(this.apiUrl, mantenimiento);
  }

  actualizarMantenimiento(id: string, mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.patch<Mantenimiento>(`${this.apiUrl}/${id}`, mantenimiento);
  }

  eliminarMantenimiento(id: string): Observable<Mantenimiento> {
    return this.http.delete<Mantenimiento>(`${this.apiUrl}/${id}`);
  }
}