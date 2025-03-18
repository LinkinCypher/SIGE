import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PermisosService, Permiso } from '../../../../services/permisos.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../models/usuario.model';

interface UsuarioSeleccionable extends Usuario {
  seleccionado?: boolean;
}

interface PermisoSeleccionable extends Permiso {
  seleccionado?: boolean;
}

@Component({
  selector: 'app-asignacion-masiva',
  templateUrl: './asignacion-masiva.page.html',
  styleUrls: ['./asignacion-masiva.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AsignacionMasivaPage implements OnInit {
  usuarios: UsuarioSeleccionable[] = [];
  usuariosFiltrados: UsuarioSeleccionable[] = [];
  permisos: PermisoSeleccionable[] = [];
  permisosFiltrados: PermisoSeleccionable[] = [];
  permisosAgrupados: { [key: string]: PermisoSeleccionable[] } = {};
  permisosAgrupadosFiltrados: { [key: string]: PermisoSeleccionable[] } = {};
  
  filtroUsuarios = '';
  filtroPermisos = '';
  isLoading = false;

  constructor(
    private permisosService: PermisosService,
    private usuariosService: UsuariosService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarPermisos();
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.usuariosService.getUsuarios(true).subscribe({
      next: (data) => {
        this.usuarios = data.map(usuario => ({
          ...usuario,
          seleccionado: false
        }));
        this.usuariosFiltrados = [...this.usuarios];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar usuarios: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  cargarPermisos() {
    this.isLoading = true;
    this.permisosService.getPermisos(true).subscribe({
      next: (data) => {
        this.permisos = data.map(permiso => ({
          ...permiso,
          seleccionado: false
        }));
        this.permisosFiltrados = [...this.permisos];
        this.agruparPermisos();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar permisos: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  filtrarUsuarios() {
    if (!this.filtroUsuarios.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    
    const termino = this.filtroUsuarios.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.nombre?.toLowerCase().includes(termino) ||
      usuario.apellido?.toLowerCase().includes(termino) ||
      usuario.username?.toLowerCase().includes(termino) ||
      usuario.cargo?.toLowerCase().includes(termino) ||
      usuario.direccion?.toLowerCase().includes(termino)
    );
  }

  filtrarPermisos() {
    if (!this.filtroPermisos.trim()) {
      this.permisosFiltrados = [...this.permisos];
    } else {
      const termino = this.filtroPermisos.toLowerCase();
      this.permisosFiltrados = this.permisos.filter(permiso =>
        permiso.nombre.toLowerCase().includes(termino) ||
        permiso.codigo.toLowerCase().includes(termino) ||
        (permiso.descripcion && permiso.descripcion.toLowerCase().includes(termino))
      );
    }
    
    this.agruparPermisos();
  }

  agruparPermisos() {
    this.permisosAgrupadosFiltrados = {};
    
    this.permisosFiltrados.forEach(permiso => {
      // Extraer el módulo (primera parte del código antes del punto)
      const modulo = permiso.codigo.split('.')[0];
      
      // Capitalizar el nombre del módulo
      const moduloNombre = modulo.charAt(0).toUpperCase() + modulo.slice(1);
      
      // Si el módulo no existe en el objeto agrupado, crearlo
      if (!this.permisosAgrupadosFiltrados[moduloNombre]) {
        this.permisosAgrupadosFiltrados[moduloNombre] = [];
      }
      
      // Agregar el permiso al grupo correspondiente
      this.permisosAgrupadosFiltrados[moduloNombre].push(permiso);
    });
  }

  seleccionarTodos(seleccionar: boolean) {
    this.usuariosFiltrados.forEach(usuario => {
      usuario.seleccionado = seleccionar;
    });
  }

  seleccionarTodosPermisos(seleccionar: boolean) {
    this.permisosFiltrados.forEach(permiso => {
      permiso.seleccionado = seleccionar;
    });
  }

  haySeleccion(): boolean {
    const hayUsuariosSeleccionados = this.usuarios.some(u => u.seleccionado);
    const hayPermisosSeleccionados = this.permisos.some(p => p.seleccionado);
    return hayUsuariosSeleccionados && hayPermisosSeleccionados;
  }

  async asignarPermisos() {
    const usuariosSeleccionados = this.usuarios.filter(u => u.seleccionado);
    const permisosSeleccionados = this.permisos.filter(p => p.seleccionado);
    
    if (usuariosSeleccionados.length === 0 || permisosSeleccionados.length === 0) {
      this.mostrarToast('Debe seleccionar al menos un usuario y un permiso', 'warning');
      return;
    }
    
    const alert = await this.alertController.create({
      header: 'Confirmar Asignación',
      message: `¿Está seguro que desea asignar ${permisosSeleccionados.length} permiso(s) a ${usuariosSeleccionados.length} usuario(s)?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Asignar',
          handler: () => {
            this.procesarAsignacion(usuariosSeleccionados, permisosSeleccionados);
          }
        }
      ]
    });
    
    await alert.present();
  }

  procesarAsignacion(usuarios: UsuarioSeleccionable[], permisos: PermisoSeleccionable[]) {
    this.isLoading = true;
    
    // Crear un array de promesas para todas las asignaciones
    const asignaciones = [];
    
    for (const usuario of usuarios) {
      if (usuario._id) {
        const permisoIds = permisos.map(p => p._id);
        asignaciones.push(
          this.permisosService.asignarMultiplesPermisos(usuario._id, permisoIds).toPromise()
        );
      }
    }
    
    // Ejecutar todas las asignaciones
    Promise.all(asignaciones)
      .then(() => {
        this.isLoading = false;
        this.mostrarToast('Permisos asignados correctamente', 'success');
        // Desmarcar todos los checkboxes
        this.seleccionarTodos(false);
        this.seleccionarTodosPermisos(false);
      })
      .catch((error) => {
        this.isLoading = false;
        this.mostrarToast('Error al asignar permisos: ' + (error.message || 'Error de servidor'), 'danger');
      });
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