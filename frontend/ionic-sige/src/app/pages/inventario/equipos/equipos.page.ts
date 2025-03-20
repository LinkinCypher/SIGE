import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EquiposService } from '../../../services/equipos.service';
import { TiposService } from '../../../services/tipos.service';
import { MarcasService } from '../../../services/marcas.service';
import { Equipo } from '../../../models/equipo.model';
import { Tipo } from '../../../models/tipo.model';
import { Marca } from '../../../models/marca.model';
import { EquiposFormComponent } from '../equipos-form/equipos-form.component';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.page.html',
  styleUrls: ['./equipos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class EquiposPage implements OnInit {
  equipos: Equipo[] = [];
  tipos: Tipo[] = [];
  marcas: Marca[] = [];
  cargando: boolean = false;

  constructor(
    private equiposService: EquiposService,
    private tiposService: TiposService,
    private marcasService: MarcasService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarEquipos();
    this.cargarCatalogos();
  }

  async cargarEquipos() {
    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando equipos...'
    });
    await loading.present();

    this.equiposService.getEquipos().subscribe({
      next: (equipos) => {
        this.equipos = equipos;
        this.cargando = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al cargar equipos:', error);
        this.cargando = false;
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar los equipos',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async cargarCatalogos() {
    const loading = await this.loadingController.create({
      message: 'Cargando catálogos...'
    });
    await loading.present();

    // Cargar tipos
    this.tiposService.getTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
        // Cargar marcas después de tipos
        this.marcasService.getMarcas().subscribe({
          next: (marcas) => {
            this.marcas = marcas;
            loading.dismiss();
          },
          error: (error) => {
            console.error('Error al cargar marcas:', error);
            loading.dismiss();
            this.mostrarError('Error al cargar las marcas');
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar tipos:', error);
        loading.dismiss();
        this.mostrarError('Error al cargar los tipos de equipo');
      }
    });
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }

  async mostrarFormulario(equipo?: Equipo) {
    const modal = await this.modalController.create({
      component: EquiposFormComponent,
      componentProps: {
        equipo: equipo || null,
        tipos: this.tipos,
        marcas: this.marcas
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    
    if (role === 'confirmar' && data) {
      if (equipo && equipo._id) {
        this.actualizarEquipo(equipo._id, data);
      } else {
        this.crearEquipo(data);
      }
    }
  }

  async crearEquipo(formData: any) {
    const loading = await this.loadingController.create({
      message: 'Creando equipo...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';

    const nuevoEquipo: Equipo = {
      ...formData,
      activo: true,
      usuarioCreacion: usuarioActual
    };

    this.equiposService.crearEquipo(nuevoEquipo).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Equipo creado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarEquipos();
      },
      error: async (error) => {
        console.error('Error al crear equipo:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al crear el equipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async actualizarEquipo(id: string, formData: any) {
    const loading = await this.loadingController.create({
      message: 'Actualizando equipo...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';

    const equipoActualizado: Equipo = {
      ...formData,
      activo: true,
      usuarioModificacion: usuarioActual
    };

    this.equiposService.actualizarEquipo(id, equipoActualizado).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Equipo actualizado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarEquipos();
      },
      error: async (error) => {
        console.error('Error al actualizar equipo:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el equipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async confirmarEliminar(equipo: Equipo) {
    if (!equipo._id) {
      console.error('ID de equipo no válido');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar el equipo "${equipo.modelo} (${equipo.codigo})"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarEquipo(equipo);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarEquipo(equipo: Equipo) {
    if (!equipo._id) {
      console.error('ID de equipo no válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Eliminando equipo...'
    });
    await loading.present();

    // Obtener el usuario actual
    const usuarioActual = localStorage.getItem('usuario') || 'admin';

    this.equiposService.eliminarEquipo(equipo._id, usuarioActual).subscribe({
      next: async () => {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Equipo eliminado correctamente',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.cargarEquipos();
      },
      error: async (error) => {
        console.error('Error al eliminar equipo:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al eliminar el equipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  getNombreTipo(tipo: string | Tipo): string {
    if (typeof tipo === 'string') {
      const tipoEncontrado = this.tipos.find(t => t._id === tipo);
      return tipoEncontrado ? tipoEncontrado.nombre : 'Tipo no encontrado';
    } else {
      return tipo.nombre;
    }
  }

  getNombreMarca(marca: string | Marca): string {
    if (typeof marca === 'string') {
      const marcaEncontrada = this.marcas.find(m => m._id === marca);
      return marcaEncontrada ? marcaEncontrada.nombre : 'Marca no encontrada';
    } else {
      return marca.nombre;
    }
  }
}