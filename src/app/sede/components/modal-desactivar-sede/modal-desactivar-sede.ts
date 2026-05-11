import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { SedeService } from '../../service/sede-service';
import { SedeDTO } from '../../models/sede';

@Component({
  selector: 'app-modal-desactivar-sede',
  imports: [CommonModule],
  templateUrl: './modal-desactivar-sede.html',
  styleUrl: './modal-desactivar-sede.css',
})
export class ModalDesactivarSede {
  private sedeService = inject(SedeService);

  @Input() sede: SedeDTO | null = null;

  @Output() confirmado = new EventEmitter<void>();
  @Output() cerrar     = new EventEmitter<void>();

  procesando = signal(false);
  errorMsg   = signal<string | null>(null);

  get esActivar(): boolean {
    return this.sede?.activo === false;
  }

  confirmar(): void {
    if (!this.sede?.id) return;
    this.procesando.set(true);
    this.errorMsg.set(null);

    const accion = this.esActivar
      ? this.sedeService.activar(this.sede.id)
      : this.sedeService.desactivar(this.sede.id);

    accion.subscribe({
      next: () => {
        this.procesando.set(false);
        this.confirmado.emit();
      },
      error: () => {
        this.errorMsg.set(`Ocurrió un error al ${this.esActivar ? 'activar' : 'desactivar'} la sede.`);
        this.procesando.set(false);
      }
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
