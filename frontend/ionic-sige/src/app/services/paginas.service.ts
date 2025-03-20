import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Pagina {
  _id?: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  ruta: string;
  icono?: string;
  esModulo: boolean;
  permisoId: string | any;
  moduloPadreId?: string | any;
  activo: boolean;
  orden: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface PaginaArbol extends Pagina {
  hijos?: PaginaArbol[];
}

@Injectable({
  providedIn: 'root'
})
export class PaginasService {
  private apiUrl = `${environment.URL_API_USUARIOS}/paginas`;

  constructor(private http: HttpClient) { }

  // Obtener todas las páginas con filtros opcionales
  getAll(activo?: boolean, esModulo?: boolean): Observable<Pagina[]> {
    let params = new HttpParams();
    
    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }
    
    if (esModulo !== undefined) {
      params = params.set('esModulo', esModulo.toString());
    }
    
    return this.http.get<Pagina[]>(this.apiUrl, { params });
  }

  // Obtener una página por ID
  getById(id: string): Observable<Pagina> {
    return this.http.get<Pagina>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva página
  create(pagina: Pagina): Observable<Pagina> {
    return this.http.post<Pagina>(this.apiUrl, pagina);
  }

  // Actualizar una página existente
  update(id: string, pagina: Partial<Pagina>): Observable<Pagina> {
    return this.http.patch<Pagina>(`${this.apiUrl}/${id}`, pagina);
  }

  // Eliminar una página
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Activar una página
  activar(id: string): Observable<Pagina> {
    return this.http.patch<Pagina>(`${this.apiUrl}/${id}/activar`, {});
  }

  // Desactivar una página
  desactivar(id: string): Observable<Pagina> {
    return this.http.patch<Pagina>(`${this.apiUrl}/${id}/desactivar`, {});
  }

  // Obtener páginas de un módulo específico
  getByModuloPadre(moduloPadreId: string): Observable<Pagina[]> {
    return this.http.get<Pagina[]>(`${this.apiUrl}/modulo/${moduloPadreId}`);
  }

  // Obtener páginas de nivel superior (sin módulo padre)
  getNivelSuperior(): Observable<Pagina[]> {
    return this.http.get<Pagina[]>(`${this.apiUrl}/nivel-superior`);
  }

  // Obtener árbol completo de páginas
  getArbolPaginas(): Observable<PaginaArbol[]> {
    return this.http.get<PaginaArbol[]>(`${this.apiUrl}/arbol`);
  }

  // Obtener páginas por permiso
  getByPermiso(permisoId: string): Observable<Pagina[]> {
    return this.http.get<Pagina[]>(`${this.apiUrl}/permiso/${permisoId}`);
  }
}