import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.URL_API_USUARIOS;
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  private tokenKey = 'sige_token';
  private userKey = 'sige_user';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        console.log('🔍 Respuesta del backend en login:', res);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        localStorage.setItem(this.tokenKey, res.access_token);
      })
    );
  }  

  logout(): void {
    // Eliminar token y datos de usuario
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasPermission(permiso: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.permisos) {
      return false;
    }
    return user.permisos.includes(permiso);
  }

  getUser(): any {
    const usuario = localStorage.getItem(this.userKey);
    console.log('🔍 Usuario autenticado:', usuario);
    return usuario ? JSON.parse(usuario) : null;
  }   
  
  getUserPermisos(): string[] {
    const usuario = this.getUser();
    return usuario && usuario.permisos ? usuario.permisos : [];
  }  
  
}