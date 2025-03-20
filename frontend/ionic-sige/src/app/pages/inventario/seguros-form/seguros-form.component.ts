import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Seguro, HistorialItem } from '../../../models/seguro.model';
import { Equipo } from '../../../models/equipo.model';
import { EquiposService } from '../../../services/equipos.service';

@Component({
  selector: 'app-seguros-form',
  templateUrl: './seguros-form.component.html',
  styleUrls: ['./seguros-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class SegurosFormComponent implements OnInit {
  @Input() seguro: Seguro | null = null;
  @Input() equipoId: string | null = null;
  @Input() esActualizacionEstado: boolean = false;
  
  seguroForm: FormGroup;
  historialForm: FormGroup;
  modoEdicion: boolean = false;
  equipos: Equipo[] = [];
  cargandoEquipos: boolean = false;
  equipoSeleccionado: Equipo | null = null;
  estadosSeguro: string[] = [
    'En trámite',
    'Aprobado',
    'Rechazado',
    'Vencido',
    'Renovado',
    'De baja'
  ];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private equiposService: EquiposService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.seguroForm = this.fb.group({
      equipo: ['', Validators.required],
      aseguradora: [''],
      numeroPoliza: [''],
      fechaInicio: [''],
      fechaFin: [''],
      valorAsegurado: [0]
    });

    this.historialForm = this.fb.group({
      estado: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.modoEdicion = !!this.seguro;
    
    if (!this.esActualizacionEstado) {
      this.cargarEquipos();
    }
    
    if (this.seguro) {
      this.seguroForm.patchValue({
        equipo: typeof this.seguro.equipo === 'string' ? this.seguro.equipo : this.seguro.equipo._id,
        aseguradora: this.seguro.aseguradora,
        numeroPoliza: this.seguro.numeroPoliza,
        fechaInicio: this.seguro.fechaInicio ? this.formatoFecha(this.seguro.fechaInicio) : '',
        fechaFin: this.seguro.fechaFin ? this.formatoFecha(this.seguro.fechaFin) : '',
        valorAsegurado: this.seguro.valorAsegurado
      });

      // Si es sólo actualización de estado, deshabilitar los campos principales
      if (this.esActualizacionEstado) {
        this.seguroForm.disable();
      }
    } else if (this.equipoId) {
      // Si se proporciona un equipoId (caso de agregar seguro desde detalles de equipo)
      this.seguroForm.get('equipo')?.setValue(this.equipoId);
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
        const equipoId = this.seguroForm.get('equipo')?.value;
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
    if (this.esActualizacionEstado) {
      if (this.historialForm.valid) {
        this.modalController.dismiss({
          historialItem: this.historialForm.value
        }, 'confirmar');
      } else {
        this.historialForm.markAllAsTouched();
      }
    } else {
      if (this.seguroForm.valid && this.historialForm.valid) {
        this.modalController.dismiss({
          seguro: this.seguroForm.value,
          historialItem: this.historialForm.value
        }, 'confirmar');
      } else {
        // Marcar todos los controles como touched para mostrar errores
        this.seguroForm.markAllAsTouched();
        this.historialForm.markAllAsTouched();
      }
    }
  }
}