import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

interface ModuloMenu {
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit {
  user: Usuario | null = null;
  modulos: ModuloMenu[] = [
    {
      nombre: 'Administración del Sistema',
      descripcion: 'Configuración y administración general del sistema',
      ruta: '/admin/sistema',
      icono: 'settings-outline'
    },
    {
      nombre: 'Estructura Organizacional',
      descripcion: 'Gestión de la estructura organizativa',
      ruta: '/admin/organizacion',
      icono: 'git-branch-outline'
    }
    // módulos según vaya creciendo el sistema
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    
    // Filtrar módulos según los permisos del usuario
    this.filtrarModulosPorPermisos();
  }

  filtrarModulosPorPermisos() {
    // lógica para filtrar los módulos según los permisos
    // Por ahora, todos los módulos para simplificar
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}