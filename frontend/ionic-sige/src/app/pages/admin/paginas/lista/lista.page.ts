import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pagina, PaginasService } from '../../../../services/paginas.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    RouterModule
  ]
})
export class ListaPage implements OnInit, OnDestroy {
  paginas: Pagina[] = [];
  paginasFiltradas: Pagina[] = [];
  terminoBusqueda = '';
  segmento = 'todos';
  private destroy$ = new Subject<void>();

  constructor(
    private paginasService: PaginasService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarPaginas();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarPaginas() {
    const loading = await this.loadingController.create({
      message: 'Cargando páginas...'
    });
    await loading.present();

    this.paginasService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paginas) => {
          this.paginas = paginas;
          this.aplicarFiltros();
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error al cargar páginas:', error);
          this.mostrarToast('Error al cargar las páginas. Intente de nuevo más tarde.');
          loading.dismiss();
        }
      });
  }

  async refrescar(event: any) {
    await this.cargarPaginas();
    event.target.complete();
  }

  buscar() {
    this.aplicarFiltros();
  }

  cambiarSegmento() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // Filtrar por segmento seleccionado
    let paginasFiltradas = [...this.paginas];
    
    if (this.segmento === 'modulos') {
      paginasFiltradas = paginasFiltradas.filter(p => p.esModulo);
    } else if (this.segmento === 'paginas') {
      paginasFiltradas = paginasFiltradas.filter(p => !p.esModulo);
    }
    
    // Filtrar por término de búsqueda
    if (this.terminoBusqueda && this.terminoBusqueda.trim() !== '') {
      const busqueda = this.terminoBusqueda.toLowerCase();
      paginasFiltradas = paginasFiltradas.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.codigo.toLowerCase().includes(busqueda) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busqueda))
      );
    }
    
    this.paginasFiltradas = paginasFiltradas;
  }

  async verDetalles(pagina: Pagina) {
    // Obtener los datos relacionados (permiso y módulo padre si corresponde)
    let permisoNombre = 'Sin asignar';
    let moduloPadreNombre = 'Nivel superior';
    
    if (pagina.permisoId) {
      if (typeof pagina.permisoId === 'object' && pagina.permisoId.nombre) {
        permisoNombre = pagina.permisoId.nombre;
      } else {
        // Aquí podríamos cargar el nombre del permiso, por simplicidad usamos el ID
        permisoNombre = `ID: ${pagina.permisoId}`;
      }
    }
    
    if (pagina.moduloPadreId) {
      if (typeof pagina.moduloPadreId === 'object' && pagina.moduloPadreId.nombre) {
        moduloPadreNombre = pagina.moduloPadreId.nombre;
      } else {
        // Aquí podríamos cargar el nombre del módulo padre, por simplicidad usamos el ID
        moduloPadreNombre = `ID: ${pagina.moduloPadreId}`;
      }
    }
    
    const alert = await this.alertController.create({
      header: pagina.nombre,
      subHeader: pagina.codigo,
      message: `
        <p><strong>Descripción:</strong> ${pagina.descripcion || 'No disponible'}</p>
        <p><strong>Ruta:</strong> ${pagina.ruta}</p>
        <p><strong>Tipo:</strong> ${pagina.esModulo ? 'Módulo' : 'Página'}</p>
        <p><strong>Permiso:</strong> ${permisoNombre}</p>
        <p><strong>Módulo padre:</strong> ${moduloPadreNombre}</p>
        <p><strong>Estado:</strong> ${pagina.activo ? 'Activo' : 'Inactivo'}</p>
        <p><strong>Orden:</strong> ${pagina.orden}</p>
        <p><strong>Icono:</strong> ${pagina.icono || 'No definido'}</p>
      `,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async confirmarEliminar(pagina: Pagina) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar la ${pagina.esModulo ? 'módulo' : 'página'} "${pagina.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarPagina(pagina._id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarPagina(id: string) {
    const loading = await this.loadingController.create({
      message: 'Eliminando...'
    });
    await loading.present();

    this.paginasService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.mostrarToast('Página eliminada con éxito');
          this.paginas = this.paginas.filter(p => p._id !== id);
          this.aplicarFiltros();
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error al eliminar página:', error);
          
          let mensaje = 'Error al eliminar la página. Intente de nuevo más tarde.';
          if (error.status === 400) {
            mensaje = 'No se puede eliminar porque hay páginas que dependen de este módulo.';
          }
          
          this.mostrarToast(mensaje);
          loading.dismiss();
        }
      });
  }

  async cambiarEstado(pagina: Pagina) {
    const loading = await this.loadingController.create({
      message: pagina.activo ? 'Desactivando...' : 'Activando...'
    });
    await loading.present();

    const accion = pagina.activo ? 
      this.paginasService.desactivar(pagina._id!) : 
      this.paginasService.activar(pagina._id!);

    accion
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paginaActualizada) => {
          this.mostrarToast(
            pagina.activo ? 'Página desactivada con éxito' : 'Página activada con éxito'
          );
          
          // Actualizar el estado en nuestra lista local
          const index = this.paginas.findIndex(p => p._id === paginaActualizada._id);
          if (index !== -1) {
            this.paginas[index] = paginaActualizada;
            this.aplicarFiltros();
          }
          
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.mostrarToast('Error al cambiar el estado de la página. Intente de nuevo más tarde.');
          loading.dismiss();
        }
      });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    
    await toast.present();
  }
}