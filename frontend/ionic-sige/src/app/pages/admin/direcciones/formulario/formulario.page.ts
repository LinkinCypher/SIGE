import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class FormularioPage implements OnInit {
  direccionForm: FormGroup;
  esNuevaDireccion = true;
  direccionId: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private direccionesService: DireccionesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.direccionForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      codigo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
      descripcion: ['']
    });
  }

  ngOnInit() {
    // Verificar si estamos en modo edición
    this.direccionId = this.route.snapshot.paramMap.get('id');
    this.esNuevaDireccion = !this.direccionId;

    if (!this.esNuevaDireccion) {
      // Cargar los datos de la dirección
      this.cargarDireccion(this.direccionId as string);
    }
  }

  cargarDireccion(id: string) {
    this.isLoading = true;
    this.direccionesService.getDireccion(id).subscribe({
      next: (direccion) => {
        // Actualizar el formulario con los datos de la dirección
        this.direccionForm.patchValue({
          nombre: direccion.nombre,
          codigo: direccion.codigo,
          descripcion: direccion.descripcion
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar la dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
        this.router.navigate(['/admin/direcciones/lista']);
      }
    });
  }

  guardarDireccion() {
    if (this.direccionForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.direccionForm.controls).forEach(key => {
        this.direccionForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.direccionForm.value;
    this.isLoading = true;

    if (this.esNuevaDireccion) {
      // Crear nueva dirección
      this.direccionesService.crearDireccion(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Dirección creada correctamente', 'success');
          this.router.navigate(['/admin/direcciones/lista']);
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al crear dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    } else {
      // Actualizar dirección existente
      this.direccionesService.actualizarDireccion(this.direccionId as string, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Dirección actualizada correctamente', 'success');
          this.router.navigate(['/admin/direcciones/detalle', this.direccionId]);
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al actualizar dirección: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  cancelar() {
    if (this.esNuevaDireccion) {
      this.router.navigate(['/admin/direcciones/lista']);
    } else {
      this.router.navigate(['/admin/direcciones/detalle', this.direccionId]);
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