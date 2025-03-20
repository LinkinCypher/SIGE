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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const permisoRequerido = route.data['permiso'] as string;
    const permisosUsuario = this.authService.getUserPermisos();
  
    console.log('🔍 Permiso requerido:', permisoRequerido);
    console.log('🔍 Permisos del usuario autenticado:', permisosUsuario);
  
    if (permisosUsuario.includes(permisoRequerido)) {
      return true;
    }
  
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
