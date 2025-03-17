import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CargosService, Cargo } from '../../../../services/cargos.service';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetallePage implements OnInit {
  cargoId: string = '';
  cargo: Cargo | null = null;
  direccion: Direccion | null = null;
  usuarios: Usuario[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cargosService: CargosService,
    private direccionesService: DireccionesService,
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargoId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.cargoId) {
      this.mostrarToast('ID de cargo no válido', 'danger');
      this.router.navigate(['/admin/cargos/lista']);
      return;
    }
    this.cargarCargo();
  }

  cargarCargo() {
    this.isLoading = true;
    this.cargosService.getCargo(this.cargoId).subscribe({
      next: (cargo) => {
        this.cargo = cargo;
        this.cargarDireccion();
        this.cargarUsuarios();
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar cargo: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.router.navigate(['/admin/cargos/lista']);
      }
    });
  }

  cargarDireccion() {
    if (this.cargo && this.cargo.direccionId) {
      this.direccionesService.getDireccion(this.cargo.direccionId).subscribe({
        next: (direccion) => {
          this.direccion = direccion;
        },
        error: (error) => {
          this.mostrarToast('Error al cargar dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  cargarUsuarios() {
    // Cargar usuarios que tienen este cargo asignado
    if (this.cargo) {
      this.usuariosService.getUsuarios(true, undefined, this.cargoId).subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al cargar usuarios: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  editarCargo() {
    this.router.navigate(['/admin/cargos/editar', this.cargoId]);
  }

  verDireccion() {
    if (this.cargo && this.cargo.direccionId) {
      this.router.navigate(['/admin/direcciones/detalle', this.cargo.direccionId]);
    }
  }

  verDetalleUsuario(usuarioId?: string) {
    if (usuarioId) {
      this.router.navigate(['/admin/usuarios/detalle', usuarioId]);
    }
  }

  async cambiarEstado() {
    if (!this.cargo) return;

    const accion = this.cargo.activo ? 'desactivar' : 'activar';
    const alert = await this.alertController.create({
      header: `${accion.charAt(0).toUpperCase() + accion.slice(1)} cargo`,
      message: `¿Está seguro que desea ${accion} el cargo "${this.cargo.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            const metodo = this.cargo!.activo
              ? this.cargosService.desactivarCargo(this.cargoId)
              : this.cargosService.activarCargo(this.cargoId);
              
            metodo.subscribe({
              next: (cargoActualizado) => {
                this.cargo = cargoActualizado;
                this.isLoading = false;
                this.mostrarToast(`Cargo ${accion}do correctamente`, 'success');
              },
              error: (error) => {
                this.isLoading = false;
                this.mostrarToast(`Error al ${accion} cargo: ` + (error.error?.message || 'Error de servidor'), 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}