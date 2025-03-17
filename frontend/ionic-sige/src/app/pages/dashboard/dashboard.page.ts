import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DireccionesService } from '../../services/direcciones.service';
import { CargosService } from '../../services/cargos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {
  isLoading = false;
  today = new Date();
  totalUsuarios = 0;
  totalDirecciones = 0;
  totalCargos = 0;

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

  cargarEstadisticas() {
    this.isLoading = true;
    
    // Cargar total de usuarios activos
    if (this.authService.hasPermission('usuarios.ver')) {
      this.usuariosService.getUsuarios(true).subscribe({
        next: (usuarios) => {
          this.totalUsuarios = usuarios.length;
        }
      });
    }
    
    // Cargar total de direcciones activas
    if (this.authService.hasPermission('direcciones.ver')) {
      this.direccionesService.getDirecciones(true).subscribe({
        next: (direcciones) => {
          this.totalDirecciones = direcciones.length;
        }
      });
    }
    
    // Cargar total de cargos activos
    if (this.authService.hasPermission('cargos.ver')) {
      this.cargosService.getCargos(true).subscribe({
        next: (cargos) => {
          this.totalCargos = cargos.length;
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  navegarA(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
}