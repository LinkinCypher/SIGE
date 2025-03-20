import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SegurosService } from '../../../services/seguros.service';
import { EquiposService } from '../../../services/equipos.service';
import { Seguro } from '../../../models/seguro.model';
import { Equipo } from '../../../models/equipo.model';
import { SegurosFormComponent } from '../seguros-form/seguros-form.component';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.page.html',
  styleUrls: ['./seguros.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class SegurosPage implements OnInit {
  seguros: Seguro[] = [];
  equipos: {[id: string]: Equipo} = {}; // Mapa de equipos por ID
  cargando: boolean = false;
  filtroEstado: string = '';

  constructor(
    private segurosService: SegurosService,
    private equiposService: EquiposService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarSeguros();
  }

  async cargarSeguros() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando seguros...'
    });
    await loading.present();

    this.segurosService.getSeguros().subscribe({
      next: (seguros) => {
        this.seguros = seguros;
        this.cargando = false;
        loading.dismiss();
        
        // Extraer IDs de equipos únicos
        const equipoIds = [...new Set(seguros.map(s => 
          typeof s.equipo === 'string' ? s.equipo : s.equipo._id
        ))];
        
        // Cargar detalles de equipos si no están en caché
        equipoIds.forEach(id => {
          if (id && !this.equipos[id]) {
            this.cargarDetallesEquipo(id);
          }
        });
      },
      error: async (error) => {
        console.error('Error al cargar seguros:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar los seguros',
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

  async mostrarFormulario(seguro?: Seguro) {
    const modal = await this.modalController.create({
      component: SegurosFormComponent,
      componentProps: {
        seguro: seguro || null,
        esActualizacionEstado: false
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    
    if (role === 'confirmar' && data) {
      if (seguro && seguro._id) {
        this.actualizarSeguro(seguro._id, data);
      } else {
        this.crearSeguro(data);
      }
    }
  }

  async actualizarEstado(seguro: Seguro) {
    if (!seguro._id) {
      console.error('ID de seguro no válido');
      return;
    }

    const modal = await this.modalController.create({
      component: SegurosFormComponent,
      componentProps: {
        seguro: seguro,
        esActualizacionEstado: true
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    
    if (role === 'confirmar' && data && data.historialItem) {
      this.agregarHistorialSeguro(seguro._id, data.historialItem);
    }
  }

  async crearSeguro(data: any) {
    const loading = await this.loadingController.create({
      message: 'Registrando seguro...'
    });
    await loading.present();

    // Obtener datos del usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';

    // Preparar los datos del seguro y el historial inicial
    const historialItem = {
      ...data.historialItem,
      fecha: new Date(),
      usuario: {
        id: usuarioActual,
        nombre: nombreUsuario
      }
    };

    const nuevoSeguro = {
      ...data.seguro,
      historialItem: historialItem,
      usuarioCreacion: usuarioActual
    };

    this.segurosService.crearSeguro(nuevoSeguro).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Seguro registrado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarSeguros();
      },
      error: async (error) => {
        console.error('Error al registrar seguro:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al registrar el seguro',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async actualizarSeguro(id: string, data: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando seguro...'
    });
    await loading.present();

    // Obtener datos del usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';

    // Preparar los datos del seguro y el historial
    const historialItem = {
      ...data.historialItem,
      fecha: new Date(),
      usuario: {
        id: usuarioActual,
        nombre: nombreUsuario
      }
    };

    const seguroActualizado = {
      ...data.seguro,
      nuevoHistorialItem: historialItem,
      usuarioModificacion: usuarioActual
    };

    this.segurosService.actualizarSeguro(id, seguroActualizado).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Seguro actualizado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarSeguros();
      },
      error: async (error) => {
        console.error('Error al actualizar seguro:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el seguro',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async agregarHistorialSeguro(id: string, historialItem: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando estado...'
    });
    await loading.present();
  
    // Obtener datos del usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administrador';
  
    // Buscar el seguro actual para mantener sus datos
    const seguroActual = this.seguros.find(s => s._id === id);
    if (!seguroActual) {
      const toast = await this.toastController.create({
        message: 'Error: No se encontró el seguro a actualizar',
        duration: 3000,
        color: 'danger'
      });
      loading.dismiss();
      toast.present();
      return;
    }
  
    // Preparar los datos del historial
    const nuevoHistorialItem = {
      ...historialItem,
      fecha: new Date(),
      usuario: {
        id: usuarioActual,
        nombre: nombreUsuario
      }
    };
  
    // Crear un objeto Seguro completo para la actualización
    const seguroActualizado: Seguro = {
      equipo: seguroActual.equipo,
      historial: seguroActual.historial || [],
      aseguradora: seguroActual.aseguradora,
      numeroPoliza: seguroActual.numeroPoliza,
      fechaInicio: seguroActual.fechaInicio,
      fechaFin: seguroActual.fechaFin,
      valorAsegurado: seguroActual.valorAsegurado,
      nuevoHistorialItem: nuevoHistorialItem,
      usuarioModificacion: usuarioActual
    };
  
    this.segurosService.actualizarSeguro(id, seguroActualizado).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Estado actualizado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarSeguros();
      },
      error: async (error) => {
        console.error('Error al actualizar estado:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el estado del seguro',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async confirmarEliminar(seguro: Seguro) {
    if (!seguro._id) {
      console.error('ID de seguro no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar el seguro para el equipo "${this.getInfoEquipo(seguro.equipo)}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarSeguro(seguro);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarSeguro(seguro: Seguro) {
    if (!seguro._id) {
      console.error('ID de seguro no válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Eliminando seguro...'
    });
    await loading.present();

    this.segurosService.eliminarSeguro(seguro._id).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Seguro eliminado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarSeguros();
      },
      error: async (error) => {
        console.error('Error al eliminar seguro:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al eliminar el seguro',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  // Filtra los seguros por estado
  filtrarPorEstado(event: any) {
    this.filtroEstado = event.detail.value;
    this.cargarSeguros(); // Cargar todos y luego filtrar
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

  // Obtener el último estado del seguro
  getUltimoEstado(seguro: Seguro): string {
    if (seguro.historial && seguro.historial.length > 0) {
      // Ordenar por fecha descendente y tomar el primero
      const historialOrdenado = [...seguro.historial].sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      return historialOrdenado[0].estado;
    }
    return 'No disponible';
  }

  // Obtener el color según el estado
  getColorEstado(estado: string): string {
    switch (estado) {
      case 'Aprobado':
        return 'success';
      case 'En trámite':
        return 'warning';
      case 'Rechazado':
        return 'danger';
      case 'Vencido':
        return 'medium';
      case 'Renovado':
        return 'tertiary';
      case 'De baja':
        return 'light';
      default:
        return 'primary';
    }
  }
}