import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Cargo {
  _id: string;
  nombre: string;
  descripcion?: string;
  direccionId: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CargosService {
  private apiUrl = `${environment.apiUrl}/cargos`;

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
}