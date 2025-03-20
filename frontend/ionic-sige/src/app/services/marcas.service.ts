import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = `${environment.URL_API_INVENTARIO}/marcas`;

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  getMarca(id: string): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`);
  }

  crearMarca(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca);
  }

  actualizarMarca(id: string, marca: Marca): Observable<Marca> {
    return this.http.patch<Marca>(`${this.apiUrl}/${id}`, marca);
  }

  eliminarMarca(id: string, usuario: string): Observable<Marca> {
    return this.http.delete<Marca>(`${this.apiUrl}/${id}?usuario=${usuario}`);
  }
}