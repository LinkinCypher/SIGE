import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MantenimientosService } from '../../../services/mantenimientos.service';
import { EquiposService } from '../../../services/equipos.service';
import { Mantenimiento } from '../../../models/mantenimiento.model';
import { Equipo } from '../../../models/equipo.model';
import { MantenimientosFormComponent } from '../mantenimientos-form/mantenimientos-form.component';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.page.html',
  styleUrls: ['./mantenimientos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class MantenimientosPage implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  equipos: {[id: string]: Equipo} = {}; // Mapa de equipos por ID
  cargando: boolean = false;
  filtroEquipo: string = '';

  constructor(
    private mantenimientosService: MantenimientosService,
    private equiposService: EquiposService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarMantenimientos();
  }

  async cargarMantenimientos() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando mantenimientos...'
    });
    await loading.present();

    this.mantenimientosService.getMantenimientos().subscribe({
      next: (mantenimientos) => {
        this.mantenimientos = mantenimientos;
        this.cargando = false;
        loading.dismiss();
        
        // Extraer IDs de equipos únicos
        const equipoIds = [...new Set(mantenimientos.map(m => 
          typeof m.equipo === 'string' ? m.equipo : m.equipo._id
        ))];
        
        // Cargar detalles de equipos si no están en caché
        equipoIds.forEach(id => {
          if (id && !this.equipos[id]) {
            this.cargarDetallesEquipo(id);
          }
        });
      },
      error: async (error) => {
        console.error('Error al cargar mantenimientos:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar los mantenimientos',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async cargarDetallesEquipo(equipoId: string) {
    this.equiposService.getEquipo(equipoId).subscribe({
      next: (equipo) => {
        this.equipos[equipoId] = equipo;
      },
      error: (error) => {
        console.error(`Error al cargar detalles del equipo ${equipoId}:`, error);
      }
    });
  }

  async mostrarFormulario(mantenimiento?: Mantenimiento) {
    const modal = await this.modalController.create({
      component: MantenimientosFormComponent,
      componentProps: {
        mantenimiento: mantenimiento || null,
        equipoId: this.filtroEquipo || null
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    
    if (role === 'confirmar' && data) {
      if (mantenimiento && mantenimiento._id) {
        this.actualizarMantenimiento(mantenimiento._id, data);
      } else {
        this.crearMantenimiento(data);
      }
    }
  }

  async crearMantenimiento(formData: any) {
    const loading = await this.loadingController.create({
      message: 'Registrando mantenimiento...'
    });
    await loading.present();

    // Obtener datos del usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';

    const nuevoMantenimiento: Mantenimiento = {
      ...formData,
      tecnico: {
        id: usuarioActual,
        nombre: nombreUsuario
      },
      usuarioCreacion: usuarioActual
    };

    this.mantenimientosService.crearMantenimiento(nuevoMantenimiento).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Mantenimiento registrado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMantenimientos();
      },
      error: async (error) => {
        console.error('Error al registrar mantenimiento:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al registrar el mantenimiento',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async actualizarMantenimiento(id: string, formData: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando mantenimiento...'
    });
    await loading.present();

    // Obtener datos del usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';

    const mantenimientoActualizado: Mantenimiento = {
      ...formData,
      tecnico: {
        id: usuarioActual,
        nombre: nombreUsuario
      },
      usuarioModificacion: usuarioActual
    };

    this.mantenimientosService.actualizarMantenimiento(id, mantenimientoActualizado).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Mantenimiento actualizado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMantenimientos();
      },
      error: async (error) => {
        console.error('Error al actualizar mantenimiento:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el mantenimiento',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async confirmarEliminar(mantenimiento: Mantenimiento) {
    if (!mantenimiento._id) {
      console.error('ID de mantenimiento no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar el mantenimiento con código "${mantenimiento.codigo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarMantenimiento(mantenimiento);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarMantenimiento(mantenimiento: Mantenimiento) {
    if (!mantenimiento._id) {
      console.error('ID de mantenimiento no válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Eliminando mantenimiento...'
    });
    await loading.present();

    this.mantenimientosService.eliminarMantenimiento(mantenimiento._id).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Mantenimiento eliminado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMantenimientos();
      },
      error: async (error) => {
        console.error('Error al eliminar mantenimiento:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al eliminar el mantenimiento',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  // Filtra los mantenimientos por equipo
  filtrarPorEquipo(event: any) {
    this.filtroEquipo = event.detail.value;
    if (this.filtroEquipo) {
      this.cargarMantenimientosPorEquipo(this.filtroEquipo);
    } else {
      this.cargarMantenimientos();
    }
  }

  async cargarMantenimientosPorEquipo(equipoId: string) {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Filtrando mantenimientos...'
    });
    await loading.present();

    this.mantenimientosService.getMantenimientosPorEquipo(equipoId).subscribe({
      next: (mantenimientos) => {
        this.mantenimientos = mantenimientos;
        this.cargando = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al filtrar mantenimientos:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al filtrar los mantenimientos',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  // Obtener información del equipo
  getInfoEquipo(equipo: string | Equipo): string {
    if (typeof equipo === 'string') {
      return this.equipos[equipo] 
        ? `${this.equipos[equipo].modelo} - ${this.equipos[equipo].codigo}` 
        : 'Cargando...';
    } else {
      return `${equipo.modelo} - ${equipo.codigo}`;
    }
  }
}