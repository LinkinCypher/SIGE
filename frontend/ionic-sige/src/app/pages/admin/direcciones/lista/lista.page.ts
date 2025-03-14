import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaPage implements OnInit {
  direcciones: Direccion[] = [];
  direccionesFiltradas: Direccion[] = [];
  isLoading = false;
  terminoBusqueda = '';
  filtroActivo = 'true';

  constructor(
    private direccionesService: DireccionesService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarDirecciones();
  }

  cargarDirecciones() {
    this.isLoading = true;
    
    this.direccionesService.getDirecciones(this.filtroActivo === 'true').subscribe({
      next: (data) => {
        this.direcciones = data;
        this.filtrarDirecciones();
        this.isLoading = false;
      },
      error: async (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar direcciones: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  filtrarDirecciones() {
    if (!this.terminoBusqueda.trim()) {
      this.direccionesFiltradas = [...this.direcciones];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.direccionesFiltradas = this.direcciones.filter(direccion => 
      direccion.nombre.toLowerCase().includes(termino) || 
      direccion.codigo.toLowerCase().includes(termino) || 
      (direccion.descripcion && direccion.descripcion.toLowerCase().includes(termino))
    );
  }

  cambiarFiltro() {
    this.cargarDirecciones();
  }

  doRefresh(event: any) {
    this.cargarDirecciones();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  crearDireccion() {
    this.router.navigate(['/admin/direcciones/crear']);
  }

  verDetalle(id?: string) {
    if (id) {
      this.router.navigate(['/admin/direcciones/detalle', id]);
    }
  }

  editarDireccion(id?: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (id) {
      this.router.navigate(['/admin/direcciones/editar', id]);
    }
  }

  async cambiarEstado(direccion: Direccion, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (!direccion._id) return;

    const accion = direccion.activo ? 'desactivar' : 'activar';

    const alert = await this.alertController.create({
      header: `${accion.charAt(0).toUpperCase() + accion.slice(1)} dirección`,
      message: `¿Está seguro que desea ${accion} la dirección "${direccion.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            
            const metodo = direccion.activo 
              ? this.direccionesService.desactivarDireccion(direccion._id!)
              : this.direccionesService.activarDireccion(direccion._id!);
            
            metodo.subscribe({
              next: () => {
                this.isLoading = false;
                this.mostrarToast(`Dirección ${accion}da correctamente`, 'success');
                this.cargarDirecciones();
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