import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PermisosService, Permiso } from '../../../../services/permisos.service';
import { AuthService } from '../../../../services/auth.service'; 

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaPage implements OnInit {
  permisos: Permiso[] = [];
  permisosFiltrados: Permiso[] = [];
  permisosAgrupados: { [key: string]: Permiso[] } = {};
  isLoading = false;
  terminoBusqueda = '';
  filtroActivo = 'true';

  constructor(
    private permisosService: PermisosService,
    private toastController: ToastController,
    private router: Router,
    public authService: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarPermisos();
  }

  cargarPermisos() {
    this.isLoading = true;
    this.permisosService.getPermisos(this.filtroActivo === 'true').subscribe({
      next: (data) => {
        this.permisos = data;
        this.filtrarPermisos();
        this.isLoading = false;
      },
      error: async (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar permisos: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  filtrarPermisos() {
    if (!this.terminoBusqueda.trim()) {
      this.permisosFiltrados = [...this.permisos];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.permisosFiltrados = this.permisos.filter(permiso =>
        permiso.nombre.toLowerCase().includes(termino) ||
        permiso.codigo.toLowerCase().includes(termino) ||
        (permiso.descripcion && permiso.descripcion.toLowerCase().includes(termino))
      );
    }
    
    // Agrupar permisos por módulo (primera parte del código antes del punto)
    this.agruparPermisos();
  }

  agruparPermisos() {
    this.permisosAgrupados = {};
    
    this.permisosFiltrados.forEach(permiso => {
      // Extraer el módulo (primera parte del código antes del punto)
      const modulo = permiso.codigo.split('.')[0];
      
      // Capitalizar el nombre del módulo
      const moduloNombre = modulo.charAt(0).toUpperCase() + modulo.slice(1);
      
      // Si el módulo no existe en el objeto agrupado, crearlo
      if (!this.permisosAgrupados[moduloNombre]) {
        this.permisosAgrupados[moduloNombre] = [];
      }
      
      // Agregar el permiso al grupo correspondiente
      this.permisosAgrupados[moduloNombre].push(permiso);
    });
  }

  cambiarFiltro() {
    this.cargarPermisos();
  }

  doRefresh(event: any) {
    this.cargarPermisos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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

  irAAsignacionMasiva() {
    this.router.navigate(['/admin/permisos/asignacion-masiva']);
  }

  async cambiarEstado(permiso: Permiso, event: Event) {
    // Evitar que el evento se propague (para no abrir el detalle)
    event.stopPropagation();
    
    if (!permiso._id) return;
    
    const accion = permiso.activo ? 'desactivar' : 'activar';
    
    const alert = await this.alertController.create({
      header: `${accion.charAt(0).toUpperCase() + accion.slice(1)} permiso`,
      message: `¿Está seguro que desea ${accion} el permiso "${permiso.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isLoading = true;
            
            const metodo = permiso.activo
              ? this.permisosService.desactivarPermiso(permiso._id!)
              : this.permisosService.activarPermiso(permiso._id!);
              
            metodo.subscribe({
              next: () => {
                this.isLoading = false;
                this.mostrarToast(`Permiso ${accion}do correctamente`, 'success');
                this.cargarPermisos();
              },
              error: (error) => {
                this.isLoading = false;
                this.mostrarToast(`Error al ${accion} permiso: ` + (error.error?.message || 'Error de servidor'), 'danger');
              }
            });
          }
        }
      ]
    });
    
    await alert.present();
  }
}