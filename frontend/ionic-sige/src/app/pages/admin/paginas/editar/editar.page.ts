import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Pagina, PaginasService } from '../../../../services/paginas.service';
import { PermisosService } from '../../../../services/permisos.service';

interface Permiso {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class EditarPage implements OnInit, OnDestroy {
  paginaForm: FormGroup;
  permisos: Permiso[] = [];
  modulos: Pagina[] = [];
  paginaId: string = '';
  pagina?: Pagina;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private paginasService: PaginasService,
    private permisosService: PermisosService,
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.paginaId = id;
        this.cargarDatos();
      } else {
        this.router.navigate(['/admin/paginas/lista']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarDatos() {
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

    const cargarPagina$ = this.paginasService.getById(this.paginaId).pipe(
      catchError(error => {
        console.error('Error al cargar página:', error);
        this.mostrarToast('Error al cargar los datos de la página');
        this.router.navigate(['/pages/admin/paginas/lista']);
        return of(null);
      })
    );

    // Cargar todos los datos en paralelo
    forkJoin({
      permisos: cargarPermisos$,
      pagina: cargarPagina$
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ permisos, pagina }) => {
        if (!pagina) {
          loading.dismiss();
          return;
        }

        this.permisos = permisos;
        this.pagina = pagina;

        // Ahora cargar los módulos, excluyendo el módulo actual para evitar referencias circulares
        this.paginasService.getAll(true, true)
          .pipe(
            takeUntil(this.destroy$),
            catchError(error => {
              console.error('Error al cargar módulos:', error);
              return of([]);
            })
          )
          .subscribe(modulos => {
            // Filtrar para excluir el módulo actual de la lista
            this.modulos = modulos.filter(m => m._id !== this.paginaId);
            this.cargarFormularioConDatos(pagina);
            loading.dismiss();
          });
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.mostrarToast('Error al cargar los datos. Intente de nuevo más tarde.');
        loading.dismiss();
        this.router.navigate(['/admin/paginas/lista']);
      }
    });
  }

  cargarFormularioConDatos(pagina: Pagina) {
    // Extraer los IDs si los datos vienen como objetos
    const permisoId = typeof pagina.permisoId === 'object' && pagina.permisoId ? 
      pagina.permisoId._id : pagina.permisoId;
      
    const moduloPadreId = typeof pagina.moduloPadreId === 'object' && pagina.moduloPadreId ? 
      pagina.moduloPadreId._id : pagina.moduloPadreId;

    this.paginaForm.patchValue({
      nombre: pagina.nombre,
      codigo: pagina.codigo,
      descripcion: pagina.descripcion || '',
      ruta: pagina.ruta,
      icono: pagina.icono || '',
      orden: pagina.orden,
      esModulo: pagina.esModulo,
      activo: pagina.activo,
      permisoId: permisoId,
      moduloPadreId: moduloPadreId
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
      message: 'Guardando cambios...'
    });
    await loading.present();

    const paginaData = this.paginaForm.value;

    this.paginasService.update(this.paginaId, paginaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          loading.dismiss();
          this.mostrarToast('Página actualizada con éxito');
          this.router.navigate(['/admin/paginas/lista']);
        },
        error: (error) => {
          loading.dismiss();
          console.error('Error al actualizar página:', error);
          
          let mensaje = 'Error al actualizar la página. Intente de nuevo más tarde.';
          if (error.status === 409) {
            mensaje = 'Ya existe otra página con el mismo código o ruta.';
          } else if (error.status === 400) {
            mensaje = error.error?.message || 'Datos inválidos. Revise los campos e intente de nuevo.';
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