import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

interface AppPage {
  title: string;
  url: string;
  icon: string;
  permiso?: string; // Permiso requerido para ver esta opción
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // Importar módulos necesarios
})
export class AppComponent implements OnInit {
  // Lista completa de páginas
  private allPages: AppPage[] = [
    { title: 'Inicio', url: '/dashboard', icon: 'home-outline' },
    { title: 'Usuarios', url: '/admin/usuarios/lista', icon: 'people-outline', permiso: 'usuarios.ver' },
    { title: 'Direcciones', url: '/admin/direcciones/lista', icon: 'business-outline', permiso: 'direcciones.ver' },
    { title: 'Cargos', url: '/admin/cargos/lista', icon: 'briefcase-outline', permiso: 'cargos.ver' },
    { title: 'Páginas', url: '/admin/paginas/lista', icon: 'document-text-outline', permiso: 'paginas.ver' }, // Nueva entrada para gestión de páginas
    { title: 'Permisos', url: '/admin/permisos/lista', icon: 'key-outline', permiso: 'permisos.ver' }
  ];
  
  // Páginas filtradas según permisos
  public appPages: AppPage[] = [];
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}
  
  ngOnInit() {
    // Suscribirse a cambios en el usuario actual
    this.authService.currentUser.subscribe(user => {
      this.updateMenu();
    });
  }
  
  updateMenu() {
    if (!this.authService.isLoggedIn()) {
      this.appPages = [];
      return;
    }
    
    // Filtrar páginas según permisos
    this.appPages = this.allPages.filter(page => {
      // Si no requiere permiso, mostrar siempre
      if (!page.permiso) return true;
      
      // Verificar si tiene el permiso requerido
      return this.authService.hasPermission(page.permiso);
    });
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