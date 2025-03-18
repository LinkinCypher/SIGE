import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../../services/usuarios.service';
import { DireccionesService } from '../../../../services/direcciones.service';
import { CargosService } from '../../../../services/cargos.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class FormularioPage implements OnInit {
  usuarioForm: FormGroup;
  esNuevoUsuario = true;
  usuarioId: string | null = null;
  isLoading = false;
  cambiarPassword = false;
  fechaActual = new Date().toISOString();
  
  direcciones: any[] = [];
  cargos: any[] = [];
  cargosFiltrados: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private direccionesService: DireccionesService,
    private cargosService: CargosService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: [this.esNuevoUsuario ? new Date().toISOString() : '', Validators.required],
      email: ['', Validators.email],
      telefono: [''],
      direccionId: ['', Validators.required],
      cargoId: ['', Validators.required],
      role: ['user', Validators.required],
      cambiarPassword: [false]
    });
  }

  ngOnInit() {
    this.cargarDirecciones();
    
    // Verificar si estamos en modo edición
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    this.esNuevoUsuario = !this.usuarioId;
    
    if (!this.esNuevoUsuario) {
      // En modo edición, no requerimos contraseña inicialmente
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      
      // Cargar los datos del usuario
      this.cargarUsuario(this.usuarioId as string);
    }
  }

  cargarDirecciones() {
    this.isLoading = true;
    this.direccionesService.getDirecciones().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar direcciones: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
      }
    });
  }

  cargarCargos(direccionId: string) {
    this.isLoading = true;
    this.cargosService.getCargos(true, direccionId).subscribe({
      next: (data) => {
        this.cargos = data;
        this.cargosFiltrados = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar cargos: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
      }
    });
  }

  cargarUsuario(id: string) {
    this.isLoading = true;
    this.usuariosService.getUsuario(id).subscribe({
      next: (usuario: any) => { // Usar any para evitar errores de tipo
        // Asignar cada campo individualmente
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          username: usuario.username,
          fechaNacimiento: usuario.fechaNacimiento,
          email: usuario.email,
          telefono: usuario.telefono,
          direccionId: usuario.direccionId,
          cargoId: usuario.cargoId,
          role: usuario.role,
          cambiarPassword: false
        });
        
        // Cargar los cargos
        if (usuario.direccionId) {
          this.cargarCargos(usuario.direccionId.toString());
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar el usuario: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
        this.router.navigate(['/admin/usuarios/lista']);
      }
    });
  }

  onDireccionChange() {
    const direccionId = this.usuarioForm.get('direccionId')?.value;
    if (direccionId) {
      // Reset cargo selection
      this.usuarioForm.get('cargoId')?.setValue('');
      // Load cargos for selected direccion
      this.cargarCargos(direccionId);
    } else {
      this.cargosFiltrados = [];
    }
  }

  onCambiarPasswordChange(event: any) {
    this.cambiarPassword = event.detail.checked;
    
    const passwordControl = this.usuarioForm.get('password');
    if (this.cambiarPassword) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }

  onFechaNacimientoChange(event: any) {
    const fechaSeleccionada = event.detail.value;
    this.usuarioForm.get('fechaNacimiento')?.setValue(fechaSeleccionada);
  }

  async guardarUsuario() {
    console.log('Estado del formulario:', this.usuarioForm.status);
    console.log('Errores del formulario:', this.usuarioForm.errors);
    console.log('Errores por campo:', this.usuarioForm.controls);
    
    if (this.usuarioForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.usuarioForm.controls).forEach(key => {
        console.log(`Campo ${key}:`, this.usuarioForm.get(key)?.errors);
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = { ...this.usuarioForm.value };
    
    // Remover cambiarPassword que es solo para UI
    delete formData.cambiarPassword;
    
    // Si no se está cambiando la contraseña en modo edición, eliminarla del objeto
    if (!this.esNuevoUsuario && !this.cambiarPassword) {
      delete formData.password;
    }

    this.isLoading = true;
    
    if (this.esNuevoUsuario) {
      // Crear nuevo usuario
      this.usuariosService.crearUsuario(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Usuario creado correctamente', 'success');
          this.router.navigate(['/admin/usuarios/lista']);
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al crear usuario: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    } else {
      // Actualizar usuario existente
      this.usuariosService.actualizarUsuario(this.usuarioId as string, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Usuario actualizado correctamente', 'success');
          this.router.navigate(['/admin/usuarios/detalle', this.usuarioId]);
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al actualizar usuario: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  cancelar() {
    if (this.esNuevoUsuario) {
      this.router.navigate(['/admin/usuarios/lista']);
    } else {
      this.router.navigate(['/admin/usuarios/detalle', this.usuarioId]);
    }
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