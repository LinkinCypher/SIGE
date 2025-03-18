import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Pagina, PaginasService } from '../../../../services/paginas.service';
import { PermisosService } from '../../../../services/permisos.service';

interface Permiso {
  _id: string;
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class CrearPage implements OnInit, OnDestroy {
  paginaForm: FormGroup;
  permisos: Permiso[] = [];
  modulos: Pagina[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private paginasService: PaginasService,
    private permisosService: PermisosService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.paginaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: [''],
      ruta: ['', [Validators.required]],
      icono: [''],
      orden: [1, [Validators.required, Validators.min(1)]],
      esModulo: [false],
      activo: [true],
      permisoId: [null, [Validators.required]],
      moduloPadreId: [null]
    });
  }

  ngOnInit() {
    this.cargarDependencias();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarDependencias() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();

    // Preparar observables para cargar datos dependientes
    const cargarPermisos$ = this.permisosService.getPermisos().pipe(
      catchError(error => {
        console.error('Error al cargar permisos:', error);
        return of([]);
      })
    );

    const cargarModulos$ = this.paginasService.getAll(true, true).pipe(
      catchError(error => {
        console.error('Error al cargar módulos:', error);
        return of([]);
      })
    );

    // Cargar todos los datos en paralelo
    forkJoin({
      permisos: cargarPermisos$,
      modulos: cargarModulos$
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ permisos, modulos }) => {
        this.permisos = permisos;
        this.modulos = modulos;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.mostrarToast('Error al cargar los datos. Intente de nuevo más tarde.');
        loading.dismiss();
      }
    });
  }

  async guardar() {
    if (this.paginaForm.invalid) {
      // Marcar todos los campos como tocados para mostrar validaciones
      Object.keys(this.paginaForm.controls).forEach(key => {
        const control = this.paginaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando...'
    });
    await loading.present();

    const paginaData = this.paginaForm.value;

    this.paginasService.create(paginaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          loading.dismiss();
          this.mostrarToast('Página creada con éxito');
          this.router.navigate(['/admin/paginas/lista']);
        },
        error: (error) => {
          loading.dismiss();
          console.error('Error al crear página:', error);
          
          let mensaje = 'Error al crear la página. Intente de nuevo más tarde.';
          if (error.status === 409) {
            mensaje = 'Ya existe una página con el mismo código o ruta.';
          } else if (error.status === 400) {
            mensaje = 'Datos inválidos. Revise los campos e intente de nuevo.';
          }
          
          this.mostrarToast(mensaje);
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