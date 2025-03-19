import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PaginasService, Pagina } from './services/paginas.service';

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
  // Lista completa de páginas (como respaldo en caso de error)
  private defaultPages: AppPage[] = [
    { title: 'Inicio', url: '/dashboard', icon: 'home-outline' },
    { title: 'Usuarios', url: '/admin/usuarios/lista', icon: 'people-outline', permiso: 'usuarios.ver' },
    { title: 'Direcciones', url: '/admin/direcciones/lista', icon: 'business-outline', permiso: 'direcciones.ver' },
    { title: 'Cargos', url: '/admin/cargos/lista', icon: 'briefcase-outline', permiso: 'cargos.ver' },
    { title: 'Páginas', url: '/admin/paginas/lista', icon: 'document-text-outline', permiso: 'paginas.ver' },
    { title: 'Permisos', url: '/admin/permisos/lista', icon: 'key-outline', permiso: 'permisos.ver' }
  ];
  
  // Páginas cargadas desde la BD
  private allPages: AppPage[] = [];
  
  // Páginas filtradas según permisos
  public appPages: AppPage[] = [];
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private paginasService: PaginasService
  ) {}
  
  ngOnInit() {
    // Cargar las páginas desde la base de datos
    this.loadPaginasFromDB();
    
    // Suscribirse a cambios en el usuario actual
    this.authService.currentUser.subscribe(user => {
      this.updateMenu();
    });
  }
  
  loadPaginasFromDB() {
    // Obtener páginas activas
    this.paginasService.getAll(true).subscribe(
      (paginas: Pagina[]) => {
        // Convertir las páginas de la BD al formato AppPage
        this.allPages = paginas
          .sort((a, b) => a.orden - b.orden) // Ordenar por el campo 'orden'
          .map(pagina => {
            // Determinar el código del permiso basado en permisoId
            let codigoPermiso = '';
            if (pagina.permisoId) {
              // Si permisoId es un objeto y tiene un campo 'codigo'
              if (typeof pagina.permisoId === 'object' && pagina.permisoId.codigo) {
                codigoPermiso = pagina.permisoId.codigo;
              } else {
                // Si solo tenemos el ID, podríamos usar un mapeo o convenio de nombres
                // Por ejemplo: "permiso.ID"
                codigoPermiso = `permiso.${pagina.permisoId}`;
              }
            }
            
            return {
              title: pagina.nombre,
              url: pagina.ruta,
              icon: pagina.icono || 'document-outline', // Icono por defecto si no tiene
              permiso: codigoPermiso || undefined
            };
          });
        
        // Actualizar el menú después de cargar las páginas
        this.updateMenu();
      },
      error => {
        console.error('Error al cargar páginas:', error);
        // Usar las páginas predeterminadas en caso de error
        this.allPages = [...this.defaultPages];
        this.updateMenu();
      }
    );
  }
  
  updateMenu() {
    if (!this.authService.isLoggedIn()) {
      this.appPages = [];
      return;
    }
    
    // Si aún no hay páginas cargadas, usar las predeterminadas
    if (this.allPages.length === 0) {
      this.allPages = [...this.defaultPages];
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