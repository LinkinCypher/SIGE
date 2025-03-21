import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TiposService } from '../../../services/tipos.service';
import { Tipo } from '../../../models/tipo.model';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.page.html',
  styleUrls: ['./tipos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class TiposPage implements OnInit {
  tipos: Tipo[] = [];
  tiposFiltrados: Tipo[] = [];
  filtroActivo: string = 'activos';
  cargando: boolean = false;

  constructor(
    private tiposService: TiposService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarTipos();
  }

  filtrarTipos() {
    if (this.filtroActivo === 'activos') {
      this.tiposFiltrados = this.tipos.filter(tipo => tipo.activo);
    } else if (this.filtroActivo === 'inactivos') {
      this.tiposFiltrados = this.tipos.filter(tipo => !tipo.activo);
    } else {
      this.tiposFiltrados = [...this.tipos];
    }
  }

  async cargarTipos() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando tipos...'
    });
    await loading.present();

    this.tiposService.getTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
        this.filtrarTipos(); // Aplicar el filtro actual
        this.cargando = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al cargar tipos:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar los tipos de equipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async confirmarEliminar(tipo: Tipo) {
    if (!tipo._id) {
      console.error('ID de tipo no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar el tipo "${tipo.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarTipo(tipo);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarReactivar(tipo: Tipo) {
    if (!tipo._id) {
      console.error('ID de tipo no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar reactivación',
      message: `¿Está seguro que desea reactivar el tipo "${tipo.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Reactivar',
          role: 'confirm',
          handler: () => {
            this.reactivarTipo(tipo);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarTipo(tipo: Tipo) {
    if (!tipo._id) {
      console.error('ID de tipo no válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Eliminando tipo...'
    });
    await loading.present();

    // Obtener el usuario actual del servicio de autenticación (esto dependerá de cómo tienes implementado tu servicio)
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    this.tiposService.eliminarTipo(tipo._id, usuarioActual).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Tipo eliminado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarTipos(); // Recargar la lista
      },
      error: async (error) => {
        console.error('Error al eliminar tipo:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al eliminar el tipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async reactivarTipo(tipo: Tipo) {
    if (!tipo._id) {
      console.error('ID de tipo no válido');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Reactivando tipo...'
    });
    await loading.present();
  
    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
  
    this.tiposService.reactivarTipo(tipo._id, usuarioActual).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Tipo reactivado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarTipos();
      },
      error: async (error) => {
        console.error('Error al reactivar tipo:', error);
        console.log('Detalles del error:', error.error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al reactivar el tipo: ' + (error.error?.message || 'Error desconocido'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async mostrarFormulario(tipo?: Tipo) {
    const alert = await this.alertController.create({
      header: tipo ? 'Editar Tipo' : 'Nuevo Tipo',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          value: tipo ? tipo.nombre : ''
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción',
          value: tipo ? tipo.descripcion || '' : ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre) {
              return false; // Impedir que se cierre si no hay nombre
            }
            if (tipo && tipo._id) {
              this.actualizarTipo(tipo._id, data);
            } else {
              this.crearTipo(data);
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async crearTipo(data: { nombre: string, descripcion: string }) {
    const loading = await this.loadingController.create({
      message: 'Creando tipo...'
    });
    await loading.present();
  
    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
  
    // Objeto que cumple con la interfaz Tipo
    const nuevoTipo: Tipo = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      camposEspecificos: [],
      activo: true,
      usuarioCreacion: usuarioActual
    };
    
    // Objeto que se enviará al servidor (omitiendo activo si no está en el DTO)
    const datosPeticion = {
      nombre: nuevoTipo.nombre,
      descripcion: nuevoTipo.descripcion,
      camposEspecificos: nuevoTipo.camposEspecificos,
      usuarioCreacion: nuevoTipo.usuarioCreacion
    };
    
    console.log('Datos a enviar:', datosPeticion);
  
    this.tiposService.crearTipo(datosPeticion).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Tipo creado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarTipos();
      },
      error: async (error) => {
        console.error('Error al crear tipo:', error);
        console.log('Detalles del error:', error.error);
        
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al crear el tipo: ' + (error.error.message || 'Error desconocido'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async actualizarTipo(id: string, data: { nombre: string, descripcion: string }) {
    const loading = await this.loadingController.create({
      message: 'Actualizando tipo...'
    });
    await loading.present();
  
    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';
  
    // Estos datos cumplen con la interfaz Tipo
    const tipoActualizado: Tipo = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true,
      usuarioModificacion: usuarioActual
    };
  
    // Preparar datos para enviar al backend según el DTO
    const datosPeticion = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      usuarioModificacion: usuarioActual
    };
  
    console.log('Datos a enviar para actualizar:', datosPeticion);
  
    this.tiposService.actualizarTipo(id, datosPeticion).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Tipo actualizado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarTipos();
      },
      error: async (error) => {
        console.error('Error al actualizar tipo:', error);
        console.log('Detalles del error:', error.error);
        
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el tipo: ' + (error.error.message || 'Error desconocido'),
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}