import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CargosService, Cargo } from '../../../../services/cargos.service';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaPage implements OnInit {
  cargos: Cargo[] = [];
  cargosFiltrados: Cargo[] = [];
  direcciones: Direccion[] = [];
  direccionSeleccionada: Direccion | null = null;
  isLoading = false;
  terminoBusqueda = '';
  filtroActivo = 'true';
  filtrodireccionId = '';
  direccionId: string | null = null;

  constructor(
    private cargosService: CargosService,
    private direccionesService: DireccionesService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Verificar si se ha pasado un direccionId por la ruta
    this.route.queryParams.subscribe(params => {
      this.direccionId = params['direccionId'] || null;
      if (this.direccionId) {
        this.filtrodireccionId = this.direccionId;
        this.cargarDireccionSeleccionada();
      }
      this.cargarDirecciones();
      this.cargarCargos();
    });
  }

  cargarDirecciones() {
    this.isLoading = true;
    this.direccionesService.getDirecciones().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar direcciones: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  cargarDireccionSeleccionada() {
    if (this.direccionId) {
      this.direccionesService.getDireccion(this.direccionId).subscribe({
        next: (direccion) => {
          this.direccionSeleccionada = direccion;
        },
        error: (error) => {
          this.mostrarToast('Error al cargar la dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  cargarCargos() {
    this.isLoading = true;
    this.cargosService.getCargos(this.filtroActivo === 'true', this.filtrodireccionId || undefined).subscribe({
      next: (data) => {
        this.cargos = data;
        this.filtrarCargos();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar cargos: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  filtrarCargos() {
    if (!this.terminoBusqueda.trim()) {
      this.cargosFiltrados = [...this.cargos];
      return;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    this.cargosFiltrados = this.cargos.filter(cargo =>
      cargo.nombre.toLowerCase().includes(termino) ||
      (cargo.descripcion && cargo.descripcion.toLowerCase().includes(termino))
    );
  }

  cambiarFiltro() {
    this.cargarCargos();
  }

  cambiarFiltroDireccion() {
    this.cargarCargos();
  }

  doRefresh(event: any) {
    this.cargarCargos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  crearCargo() {
    const queryParams = this.direccionId ? { direccionId: this.direccionId } : {};
    this.router.navigate(['/admin/cargos/crear'], { queryParams });
  }

  verDetalle(id?: string) {
    if (id) {
      this.router.navigate(['/admin/cargos/detalle', id]);
    }
  }

  editarCargo(id?: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (id) {
      this.router.navigate(['/admin/cargos/editar', id]);
    }
  }

  obtenerNombreDireccion(direccionId: string): string {
    const direccion = this.direcciones.find(d => d._id === direccionId);
    return direccion ? direccion.nombre : 'Desconocida';
  }

  async cambiarEstado(cargo: Cargo, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!cargo._id) return;

    const accion = cargo.activo ? 'desactivar' : 'activar';
    const alert = await this.alertController.create({
      header: `${accion.charAt(0).toUpperCase() + accion.slice(1)} cargo`,
      message: `¿Está seguro que desea ${accion} el cargo "${cargo.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            const metodo = cargo.activo
              ? this.cargosService.desactivarCargo(cargo._id!)
              : this.cargosService.activarCargo(cargo._id!);
            metodo.subscribe({
              next: () => {
                this.isLoading = false;
                this.mostrarToast(`Cargo ${accion}do correctamente`, 'success');
                this.cargarCargos();
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