import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DireccionesService } from '../../services/direcciones.service';
import { CargosService } from '../../services/cargos.service';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit, OnDestroy {
  isLoading = false;
  today = new Date();
  totalUsuarios = 0;
  totalDirecciones = 0;
  totalCargos = 0;
  
  // Para manejar la destrucción del componente
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private usuariosService: UsuariosService,
    private direccionesService: DireccionesService,
    private cargosService: CargosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarEstadisticas();
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarEstadisticas() {
    this.isLoading = true;
    
    // Preparar observables para las diferentes llamadas
    const observables = [];
    
    // Cargar total de usuarios activos
    if (this.authService.hasPermission('usuarios.ver')) {
      const usuarios$ = this.usuariosService.getUsuarios(true).pipe(
        catchError(error => {
          console.error('Error al cargar usuarios:', error);
          return of([]);
        })
      );
      observables.push(usuarios$);
    } else {
      observables.push(of([]));
    }
    
    // Cargar total de direcciones activas
    if (this.authService.hasPermission('direcciones.ver')) {
      const direcciones$ = this.direccionesService.getDirecciones(true).pipe(
        catchError(error => {
          console.error('Error al cargar direcciones:', error);
          return of([]);
        })
      );
      observables.push(direcciones$);
    } else {
      observables.push(of([]));
    }
    
    // Cargar total de cargos activos
    if (this.authService.hasPermission('cargos.ver')) {
      const cargos$ = this.cargosService.getCargos(true).pipe(
        catchError(error => {
          console.error('Error al cargar cargos:', error);
          return of([]);
        })
      );
      observables.push(cargos$);
    } else {
      observables.push(of([]));
    }
    
    // Realizar todas las llamadas en paralelo
    forkJoin(observables)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          // Siempre se ejecutará, incluso si hay errores
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ([usuarios, direcciones, cargos]) => {
          if (Array.isArray(usuarios)) this.totalUsuarios = usuarios.length;
          if (Array.isArray(direcciones)) this.totalDirecciones = direcciones.length;
          if (Array.isArray(cargos)) this.totalCargos = cargos.length;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
          // No es necesario establecer isLoading = false aquí porque finalize() ya lo hace
        }
      });
  }

  navegarA(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}