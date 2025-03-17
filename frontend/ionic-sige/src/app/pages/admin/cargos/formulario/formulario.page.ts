import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CargosService, Cargo } from '../../../../services/cargos.service';
import { DireccionesService, Direccion } from '../../../../services/direcciones.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class FormularioPage implements OnInit {
  cargoForm: FormGroup;
  esNuevoCargo = true;
  cargoId: string | null = null;
  isLoading = false;
  direcciones: Direccion[] = [];
  direccionIdFijada = false;  // Para cuando se crea desde una dirección específica

  constructor(
    private formBuilder: FormBuilder,
    private cargosService: CargosService,
    private direccionesService: DireccionesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.cargoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      direccionId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDirecciones();
    
    // Verificar si estamos en modo edición
    this.cargoId = this.route.snapshot.paramMap.get('id');
    this.esNuevoCargo = !this.cargoId;

    // Verificar si se ha pasado un direccionId por la ruta (al crear desde una dirección)
    this.route.queryParams.subscribe(params => {
      const direccionId = params['direccionId'];
      if (direccionId && this.esNuevoCargo) {
        this.cargoForm.get('direccionId')?.setValue(direccionId);
        this.direccionIdFijada = true;
      }
    });

    if (!this.esNuevoCargo) {
      // Cargar los datos del cargo
      this.cargarCargo(this.cargoId as string);
    }
  }

  cargarDirecciones() {
    this.isLoading = true;
    this.direccionesService.getDirecciones().subscribe({
      next: (direcciones) => {
        this.direcciones = direcciones;
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar direcciones: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
      }
    });
  }

  cargarCargo(id: string) {
    this.isLoading = true;
    this.cargosService.getCargo(id).subscribe({
      next: (cargo) => {
        // Actualizar el formulario con los datos del cargo
        this.cargoForm.patchValue({
          nombre: cargo.nombre,
          descripcion: cargo.descripcion,
          direccionId: cargo.direccionId
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarToast('Error al cargar el cargo: ' + (error.error?.message || 'Error de servidor'), 'danger');
        this.isLoading = false;
        this.router.navigate(['/admin/cargos/lista']);
      }
    });
  }

  guardarCargo() {
    if (this.cargoForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.cargoForm.controls).forEach(key => {
        this.cargoForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.cargoForm.value;
    this.isLoading = true;

    if (this.esNuevoCargo) {
      // Crear nuevo cargo
      this.cargosService.crearCargo(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Cargo creado correctamente', 'success');
          
          // Si venimos de una dirección específica, regresar a ella
          if (this.direccionIdFijada) {
            this.router.navigate(['/admin/direcciones/detalle', formData.direccionId]);
          } else {
            this.router.navigate(['/admin/cargos/lista']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al crear cargo: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    } else {
      // Actualizar cargo existente
      this.cargosService.actualizarCargo(this.cargoId as string, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.mostrarToast('Cargo actualizado correctamente', 'success');
          this.router.navigate(['/admin/cargos/detalle', this.cargoId]);
        },
        error: (error) => {
          this.isLoading = false;
          this.mostrarToast('Error al actualizar cargo: ' + (error.error?.message || 'Error de servidor'), 'danger');
        }
      });
    }
  }

  cancelar() {
    if (this.esNuevoCargo) {
      if (this.direccionIdFijada) {
        const direccionId = this.cargoForm.get('direccionId')?.value;
        this.router.navigate(['/admin/direcciones/detalle', direccionId]);
      } else {
        this.router.navigate(['/admin/cargos/lista']);
      }
    } else {
      this.router.navigate(['/admin/cargos/detalle', this.cargoId]);
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