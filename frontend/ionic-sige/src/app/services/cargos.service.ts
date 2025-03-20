import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cargo {
  _id?: string;
  nombre: string;
  descripcion?: string;
  direccionId: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CargosService {
  private apiUrl = `${environment.URL_API_USUARIOS}/cargos`;

  constructor(private http: HttpClient) { }

  getCargos(activo: boolean = true, direccionId?: string): Observable<Cargo[]> {
    let url = `${this.apiUrl}?activo=${activo}`;
    if (direccionId) {
      url += `&direccionId=${direccionId}`;
    }
    return this.http.get<Cargo[]>(url);
  }

  getCargo(id: string): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.apiUrl}/${id}`);
  }

  crearCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.apiUrl, cargo);
  }

  actualizarCargo(id: string, cargo: Cargo): Observable<Cargo> {
    return this.http.patch<Cargo>(`${this.apiUrl}/${id}`, cargo);
  }

  eliminarCargo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activarCargo(id: string): Observable<Cargo> {
    return this.http.patch<Cargo>(`${this.apiUrl}/${id}/activar`, {});
  }

  desactivarCargo(id: string): Observable<Cargo> {
    return this.http.patch<Cargo>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}