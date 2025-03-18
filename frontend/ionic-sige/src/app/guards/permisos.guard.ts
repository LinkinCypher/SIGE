import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Primero verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Obtener el permiso requerido de los datos de la ruta
    // Comprobar ambos posibles nombres para mantener compatibilidad
    const permisoRequerido = route.data['permiso'] as string;
    
    // Si no se especifica permiso, permitir acceso
    if (!permisoRequerido) {
      return true;
    }
    
    // Verificar si el usuario tiene el permiso requerido
    if (this.authService.hasPermission(permisoRequerido)) {
      return true;
    }
     
    // Usuario sin el permiso requerido
    this.presentToast('No tiene permisos para acceder a esta página');
    this.router.navigate(['/dashboard']);
    return false;
  }
  
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }
}