import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class DetallePage implements OnInit {
  usuario: Usuario | null = null;
  isLoading = false;
  usuarioId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.cargarUsuario(this.usuarioId);
    } else {
      this.mostrarToast('ID de usuario no válido', 'danger');
      this.router.navigate(['/admin/usuarios/lista']);
    }
  }

  cargarUsuario(id: string) {
    this.isLoading = true;
    this.usuariosService.getUsuario(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast(
          'Error al cargar el usuario: ' + (error.error?.message || 'Error de servidor'),
          'danger'
        );
        this.router.navigate(['/admin/usuarios/lista']);
      }
    });
  }

  editarUsuario() {
    if (this.usuarioId) {
      this.router.navigate(['/admin/usuarios/editar', this.usuarioId]);
    }
  }

  async toggleEstadoUsuario() {
    if (!this.usuario || !this.usuarioId) return;

    const isActivating = !this.usuario.activo;
    const accion = isActivating ? 'activar' : 'desactivar';

    const alert = await this.alertController.create({
      header: `${isActivating ? 'Activar' : 'Desactivar'} usuario`,
      message: `¿Está seguro que desea ${accion} este usuario?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            
            const accionFn = isActivating 
              ? this.usuariosService.activarUsuario(this.usuarioId!)
              : this.usuariosService.desactivarUsuario(this.usuarioId!);
            
            accionFn.subscribe({
              next: (usuario) => {
                this.isLoading = false;
                this.usuario = usuario;
                this.mostrarToast(`Usuario ${accion}do correctamente`, 'success');
              },
              error: (error) => {
                this.isLoading = false;
                this.mostrarToast(
                  `Error al ${accion} el usuario: ` + (error.error?.message || 'Error de servidor'),
                  'danger'
                );
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  gestionarPermisos() {
    if (this.usuarioId) {
      this.router.navigate(['/admin/permisos/usuario', this.usuarioId]);
    }
  }

  private async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}