import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListaPage implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  isLoading = false;
  terminoBusqueda = '';
  filtroActivo = 'true';

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    
    this.usuariosService.getUsuarios(this.filtroActivo === 'true').subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filtrarUsuarios();
        this.isLoading = false;
      },
      error: async (error) => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: 'Error al cargar usuarios: ' + (error.error?.message || 'Error de servidor'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  filtrarUsuarios() {
    if (!this.terminoBusqueda.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.nombre?.toLowerCase().includes(termino) ||
      usuario.apellido?.toLowerCase().includes(termino) ||
      usuario.username?.toLowerCase().includes(termino) ||
      usuario.cargo?.toLowerCase().includes(termino)
    );
  }

  cambiarFiltro() {
    this.cargarUsuarios();
  }

  doRefresh(event: any) {
    this.cargarUsuarios();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  irACrearUsuario() {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  verDetalleUsuario(id: string | undefined) {
    if (!id) {
      // Manejar el caso de ID no disponible
      this.toastController.create({
        message: 'ID de usuario no disponible',
        duration: 2000,
        color: 'warning'
      }).then(toast => toast.present());
      return;
    }
    this.router.navigate(['/admin/usuarios/detalle', id]);
  }

  async presentAlertConfirm(id: string, accion: 'activar' | 'desactivar') {
    const alert = await this.alertController.create({
      header: `${accion === 'activar' ? 'Activar' : 'Desactivar'} usuario`,
      message: `¿Está seguro que desea ${accion === 'activar' ? 'activar' : 'desactivar'} este usuario?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            if (accion === 'activar') {
              this.activarUsuario(id);
            } else {
              this.desactivarUsuario(id);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  activarUsuario(id: string) {
    this.isLoading = true;
    this.usuariosService.activarUsuario(id).subscribe({
      next: async () => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: 'Usuario activado correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.cargarUsuarios();
      },
      error: async (error) => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: 'Error al activar usuario: ' + (error.error?.message || 'Error de servidor'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  desactivarUsuario(id: string) {
    this.isLoading = true;
    this.usuariosService.desactivarUsuario(id).subscribe({
      next: async () => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: 'Usuario desactivado correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.cargarUsuarios();
      },
      error: async (error) => {
        this.isLoading = false;
        const toast = await this.toastController.create({
          message: 'Error al desactivar usuario: ' + (error.error?.message || 'Error de servidor'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}