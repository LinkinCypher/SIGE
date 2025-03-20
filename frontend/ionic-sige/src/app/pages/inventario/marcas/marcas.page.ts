import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MarcasService } from '../../../services/marcas.service';
import { Marca } from '../../../models/marca.model';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.page.html',
  styleUrls: ['./marcas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class MarcasPage implements OnInit {
  marcas: Marca[] = [];
  cargando: boolean = false;

  constructor(
    private marcasService: MarcasService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarMarcas();
  }

  async cargarMarcas() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando marcas...'
    });
    await loading.present();

    this.marcasService.getMarcas().subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        this.cargando = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al cargar marcas:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar las marcas',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async confirmarEliminar(marca: Marca) {
    if (!marca._id) {
      console.error('ID de marca no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar la marca "${marca.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarMarca(marca);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarMarca(marca: Marca) {
    if (!marca._id) {
      console.error('ID de marca no válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Eliminando marca...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    this.marcasService.eliminarMarca(marca._id, usuarioActual).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Marca eliminada correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMarcas(); // Recargar la lista
      },
      error: async (error) => {
        console.error('Error al eliminar marca:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al eliminar la marca',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async mostrarFormulario(marca?: Marca) {
    const alert = await this.alertController.create({
      header: marca ? 'Editar Marca' : 'Nueva Marca',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          value: marca ? marca.nombre : ''
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción',
          value: marca ? marca.descripcion || '' : ''
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
            if (marca && marca._id) {
              this.actualizarMarca(marca._id, data);
            } else {
              this.crearMarca(data);
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async crearMarca(data: { nombre: string, descripcion: string }) {
    const loading = await this.loadingController.create({
      message: 'Creando marca...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    const nuevaMarca: Marca = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true,
      usuarioCreacion: usuarioActual
    };

    this.marcasService.crearMarca(nuevaMarca).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Marca creada correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMarcas();
      },
      error: async (error) => {
        console.error('Error al crear marca:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al crear la marca',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async actualizarMarca(id: string, data: { nombre: string, descripcion: string }) {
    const loading = await this.loadingController.create({
      message: 'Actualizando marca...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin'; // Ejemplo simple

    const marcaActualizada: Marca = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true,
      usuarioModificacion: usuarioActual
    };

    this.marcasService.actualizarMarca(id, marcaActualizada).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Marca actualizada correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarMarcas();
      },
      error: async (error) => {
        console.error('Error al actualizar marca:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar la marca',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}