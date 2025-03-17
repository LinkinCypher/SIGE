import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';
import { CargosService } from '../../../../services/cargos.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetallePage implements OnInit {
  direccionId: string = '';
  direccion: Direccion | null = null;
  cargos: any[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private direccionesService: DireccionesService,
    private cargosService: CargosService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.direccionId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.direccionId) {
      this.mostrarToast('ID de dirección no válido', 'danger');
      this.router.navigate(['/admin/direcciones/lista']);
      return;
    }
    this.cargarDireccion();
  }

  cargarDireccion() {
    this.isLoading = true;
    this.direccionesService.getDireccion(this.direccionId).subscribe({
      next: (direccion) => {
        this.direccion = direccion;
        this.cargarCargos();
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.router.navigate(['/admin/direcciones/lista']);
      }
    });
  }

  cargarCargos() {
    this.cargosService.getCargos(true, this.direccionId).subscribe({
      next: (cargos) => {
        this.cargos = cargos;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar cargos: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  editarDireccion() {
    this.router.navigate(['/admin/direcciones/editar', this.direccionId]);
  }

  async cambiarEstado() {
    if (!this.direccion) return;

    const accion = this.direccion.activo ? 'desactivar' : 'activar';
    const alert = await this.alertController.create({
      header: `${accion.charAt(0).toUpperCase() + accion.slice(1)} dirección`,
      message: `¿Está seguro que desea ${accion} la dirección "${this.direccion.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            const metodo = this.direccion!.activo
              ? this.direccionesService.desactivarDireccion(this.direccionId)
              : this.direccionesService.activarDireccion(this.direccionId);
              
            metodo.subscribe({
              next: (direccionActualizada) => {
                this.direccion = direccionActualizada;
                this.isLoading = false;
                this.mostrarToast(`Dirección ${accion}da correctamente`, 'success');
              },
              error: (error) => {
                this.isLoading = false;
                this.mostrarToast(`Error al ${accion} dirección: ` + (error.error?.message || 'Error de servidor'), 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  verCargos() {
    this.router.navigate(['/admin/cargos/lista'], { queryParams: { direccionId: this.direccionId } });
  }

  crearCargo() {
    this.router.navigate(['/admin/cargos/crear'], { queryParams: { direccionId: this.direccionId } });
  }

  verDetalleCargo(cargoId?: string) {
    if (cargoId) {
      this.router.navigate(['/admin/cargos/detalle', cargoId]);
    }
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