import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Equipo } from '../../../models/equipo.model';
import { Tipo } from '../../../models/tipo.model';
import { Marca } from '../../../models/marca.model';

@Component({
  selector: 'app-equipos-form',
  templateUrl: './equipos-form.component.html',
  styleUrls: ['./equipos-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EquiposFormComponent implements OnInit {
  @Input() equipo: Equipo | null = null;
  @Input() tipos: Tipo[] = [];
  @Input() marcas: Marca[] = [];
  
  equipoForm: FormGroup;
  modoEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {
    this.equipoForm = this.fb.group({
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      codigo: ['', Validators.required],
      fechaAdquisicion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.modoEdicion = !!this.equipo;
    
    if (this.equipo) {
      this.equipoForm.patchValue({
        tipo: typeof this.equipo.tipo === 'string' ? this.equipo.tipo : this.equipo.tipo._id,
        marca: typeof this.equipo.marca === 'string' ? this.equipo.marca : this.equipo.marca._id,
        modelo: this.equipo.modelo,
        serie: this.equipo.serie,
        codigo: this.equipo.codigo,
        fechaAdquisicion: this.formatoFecha(this.equipo.fechaAdquisicion)
      });
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
    if (this.equipoForm.valid) {
      this.modalController.dismiss(this.equipoForm.value, 'confirmar');
    } else {
      // Marcar todos los controles como touched para mostrar errores
      Object.keys(this.equipoForm.controls).forEach(key => {
        this.equipoForm.get(key)?.markAsTouched();
      });
    }
  }
}