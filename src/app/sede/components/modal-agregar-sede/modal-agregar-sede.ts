import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { SedeService } from '../../service/sede-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SedeDTO } from '../../models/sede';


@Component({
  selector: 'app-modal-agregar-sede',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-agregar-sede.html',
  styleUrl: './modal-agregar-sede.css',
})
export class ModalAgregarSede implements OnInit{
   private sedeService = inject(SedeService);

  @Input() modoEditar   = false;
  @Input() sedeInicial: SedeDTO | null = null;

  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar   = new EventEmitter<void>();

  guardando = signal(false);
  errorMsg  = signal<string | null>(null);

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  form: SedeDTO = this.formVacio();

  ngOnInit(): void {
    if (this.modoEditar && this.sedeInicial) {
      this.form = { ...this.sedeInicial };
    }
  }

  formVacio(): SedeDTO {
    return {
      nombre:        '',
      provincia:     '',
      direccion:     '',
      telefono:      '',
      esPrincipal:   false,
      tieneRecojo:   false,
      tieneDelivery: false,
    };
  }

  guardar(): void {
    this.guardando.set(true);
    this.errorMsg.set(null);

    const accion = this.modoEditar && this.sedeInicial?.id
      ? this.sedeService.actualizar(this.sedeInicial.id, this.form)
      : this.sedeService.guardar(this.form);

    accion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit();
      },
      error: () => {
        this.errorMsg.set('Ocurrió un error al guardar la sede.');
        this.guardando.set(false);
      }
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
