import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../../services/usuarios.service';
import { PermisosService, Permiso } from '../../../../services/permisos.service';
import { Usuario } from '../../../../models/usuario.model';

@Component({
  selector: 'app-usuario-permisos',
  templateUrl: './usuario-permisos.page.html',
  styleUrls: ['./usuario-permisos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsuarioPermisosPage implements OnInit {
  usuarioId: string = '';
  usuario: Usuario | null = null;
  
  permisosAsignados: Permiso[] = [];
  permisosDisponibles: Permiso[] = [];
  
  permisosAsignadosFiltrados: Permiso[] = [];
  permisosDisponiblesFiltrados: Permiso[] = [];
  
  filtroPermisosAsignados: string = '';
  filtroPermisosDisponibles: string = '';
  
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private permisosService: PermisosService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.usuarioId) {
      this.mostrarToast('ID de usuario no válido', 'danger');
      this.router.navigate(['/admin/usuarios/lista']);
      return;
    }
    
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    
    // Cargar datos del usuario
    this.usuariosService.getUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        
        // Cargar permisos asignados
        this.cargarPermisosAsignados();
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar el usuario: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.router.navigate(['/admin/usuarios/lista']);
      }
    });
  }

  cargarPermisosAsignados() {
    this.permisosService.getPermisosDeUsuario(this.usuarioId).subscribe({
      next: (permisos) => {
        this.permisosAsignados = permisos;
        this.permisosAsignadosFiltrados = [...permisos];
        
        // Cargar todos los permisos para determinar los disponibles
        this.cargarPermisosDisponibles();
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar permisos asignados: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  cargarPermisosDisponibles() {
    this.permisosService.getPermisos().subscribe({
      next: (permisos) => {
        // Filtrar permisos que no están asignados
        const permisosAsignadosIds = this.permisosAsignados.map(p => p._id);
        this.permisosDisponibles = permisos.filter(p => !permisosAsignadosIds.includes(p._id));
        this.permisosDisponiblesFiltrados = [...this.permisosDisponibles];
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al cargar permisos disponibles: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  filtrarPermisosAsignados() {
    if (!this.filtroPermisosAsignados.trim()) {
      this.permisosAsignadosFiltrados = [...this.permisosAsignados];
      return;
    }

    const termino = this.filtroPermisosAsignados.toLowerCase();
    this.permisosAsignadosFiltrados = this.permisosAsignados.filter(permiso => 
      permiso.nombre.toLowerCase().includes(termino) ||
      permiso.codigo.toLowerCase().includes(termino) ||
      permiso.descripcion?.toLowerCase().includes(termino)
    );
  }

  filtrarPermisosDisponibles() {
    if (!this.filtroPermisosDisponibles.trim()) {
      this.permisosDisponiblesFiltrados = [...this.permisosDisponibles];
      return;
    }

    const termino = this.filtroPermisosDisponibles.toLowerCase();
    this.permisosDisponiblesFiltrados = this.permisosDisponibles.filter(permiso => 
      permiso.nombre.toLowerCase().includes(termino) ||
      permiso.codigo.toLowerCase().includes(termino) ||
      permiso.descripcion?.toLowerCase().includes(termino)
    );
  }

  async asignarPermiso(permiso: Permiso) {
    this.isLoading = true;
    
    this.permisosService.asignarPermiso(this.usuarioId, permiso._id).subscribe({
      next: () => {
        // Mover el permiso de disponibles a asignados
        this.permisosAsignados.push(permiso);
        this.permisosDisponibles = this.permisosDisponibles.filter(p => p._id !== permiso._id);
        
        // Actualizar listas filtradas
        this.filtrarPermisosAsignados();
        this.filtrarPermisosDisponibles();
        
        this.isLoading = false;
        this.mostrarToast(`Permiso "${permiso.nombre}" asignado correctamente`, 'success');
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al asignar permiso: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  async revocarPermiso(permiso: Permiso) {
    const alert = await this.alertController.create({
      header: 'Revocar permiso',
      message: `¿Está seguro que desea revocar el permiso "${permiso.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Revocar',
          handler: () => {
            this.ejecutarRevocarPermiso(permiso);
          }
        }
      ]
    });

    await alert.present();
  }

  ejecutarRevocarPermiso(permiso: Permiso) {
    this.isLoading = true;
    
    this.permisosService.revocarPermiso(this.usuarioId, permiso._id).subscribe({
      next: () => {
        // Mover el permiso de asignados a disponibles
        this.permisosDisponibles.push(permiso);
        this.permisosAsignados = this.permisosAsignados.filter(p => p._id !== permiso._id);
        
        // Actualizar listas filtradas
        this.filtrarPermisosAsignados();
        this.filtrarPermisosDisponibles();
        
        this.isLoading = false;
        this.mostrarToast(`Permiso "${permiso.nombre}" revocado correctamente`, 'success');
      },
      error: (error) => {
        this.isLoading = false;
        this.mostrarToast('Error al revocar permiso: ' + (error.error?.message || 'Error de servidor'), 'danger');
      }
    });
  }

  private async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}