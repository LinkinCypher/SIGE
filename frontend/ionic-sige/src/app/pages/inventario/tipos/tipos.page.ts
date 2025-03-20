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

  async cargarTipos() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando tipos...'
    });
    await loading.present();

    this.tiposService.getTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
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
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    const nuevoTipo: Tipo = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true,
      usuarioCreacion: usuarioActual
    };

    this.tiposService.crearTipo(nuevoTipo).subscribe({
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
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al crear el tipo',
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
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    const tipoActualizado: Tipo = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true, // Mantenemos el estado activo
      usuarioModificacion: usuarioActual
    };

    this.tiposService.actualizarTipo(id, tipoActualizado).subscribe({
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
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el tipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}