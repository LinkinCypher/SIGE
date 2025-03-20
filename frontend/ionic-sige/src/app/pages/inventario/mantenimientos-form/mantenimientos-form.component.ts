import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Mantenimiento } from '../../../models/mantenimiento.model';
import { Equipo } from '../../../models/equipo.model';
import { EquiposService } from '../../../services/equipos.service';

@Component({
  selector: 'app-mantenimientos-form',
  templateUrl: './mantenimientos-form.component.html',
  styleUrls: ['./mantenimientos-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class MantenimientosFormComponent implements OnInit {
  @Input() mantenimiento: Mantenimiento | null = null;
  @Input() equipoId: string | null = null;
  
  mantenimientoForm: FormGroup;
  modoEdicion: boolean = false;
  equipos: Equipo[] = [];
  cargandoEquipos: boolean = false;
  equipoSeleccionado: Equipo | null = null;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private equiposService: EquiposService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.mantenimientoForm = this.fb.group({
      equipo: ['', Validators.required],
      codigo: ['', Validators.required],
      fecha: ['', Validators.required],
      memoriaRam: [''],
      discoDuro: [''],
      procesador: [''],
      sistemaOperativo: [''],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.modoEdicion = !!this.mantenimiento;
    this.cargarEquipos();
    
    if (this.mantenimiento) {
      this.mantenimientoForm.patchValue({
        equipo: typeof this.mantenimiento.equipo === 'string' ? this.mantenimiento.equipo : this.mantenimiento.equipo._id,
        codigo: this.mantenimiento.codigo,
        fecha: this.formatoFecha(this.mantenimiento.fecha),
        memoriaRam: this.mantenimiento.memoriaRam,
        discoDuro: this.mantenimiento.discoDuro,
        procesador: this.mantenimiento.procesador,
        sistemaOperativo: this.mantenimiento.sistemaOperativo,
        observaciones: this.mantenimiento.observaciones
      });
    } else if (this.equipoId) {
      // Si se proporciona un equipoId (caso de agregar mantenimiento desde detalles de equipo)
      this.mantenimientoForm.get('equipo')?.setValue(this.equipoId);
      this.cargarDetallesEquipo(this.equipoId);
    }
  }

  async cargarEquipos() {
    this.cargandoEquipos = true;
    const loading = await this.loadingController.create({
      message: 'Cargando equipos...'
    });
    await loading.present();

    this.equiposService.getEquipos().subscribe({
      next: (equipos) => {
        this.equipos = equipos;
        this.cargandoEquipos = false;
        loading.dismiss();
        
        // Si ya hay un equipo seleccionado, cargar sus detalles
        const equipoId = this.mantenimientoForm.get('equipo')?.value;
        if (equipoId) {
          this.cargarDetallesEquipo(equipoId);
        }
      },
      error: async (error) => {
        console.error('Error al cargar equipos:', error);
        this.cargandoEquipos = false;
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

  async cargarDetallesEquipo(equipoId: string) {
    const loading = await this.loadingController.create({
      message: 'Cargando detalles del equipo...'
    });
    await loading.present();

    this.equiposService.getEquipo(equipoId).subscribe({
      next: (equipo) => {
        this.equipoSeleccionado = equipo;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error al cargar detalles del equipo:', error);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al cargar los detalles del equipo',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  // Cuando cambia el equipo seleccionado
  onEquipoChange(event: any) {
    const equipoId = event.detail.value;
    if (equipoId) {
      this.cargarDetallesEquipo(equipoId);
    } else {
      this.equipoSeleccionado = null;
    }
  }

  // Formatea fecha para el input de tipo date
  formatoFecha(fecha: Date | string): string {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  cancelar() {
    this.modalController.dismiss(null, 'cancelar');
  }

  guardar() {
    if (this.mantenimientoForm.valid) {
      this.modalController.dismiss(this.mantenimientoForm.value, 'confirmar');
    } else {
      // Marcar todos los controles como touched para mostrar errores
      Object.keys(this.mantenimientoForm.controls).forEach(key => {
        this.mantenimientoForm.get(key)?.markAsTouched();
      });
    }
  }
}