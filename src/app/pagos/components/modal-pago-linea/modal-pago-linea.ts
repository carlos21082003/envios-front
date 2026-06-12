import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../service/pagos-service';

@Component({
  selector: 'app-modal-pago-linea',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pago-linea.html',
  styleUrl: './modal-pago-linea.css',
})
export class ModalPagoLinea {
  private pagosService = inject(PagosService);

  envioId    = input.required<number>();
  monto      = input.required<number>();
  codigo     = input.required<string>();
  cerrar     = output<void>();
  pagado     = output<void>();

  procesando = signal(false);
  exitoso    = signal(false);
  error      = signal<string | null>(null);

  form = {
    numeroTarjeta:  '',
    nombreTitular:  '',
    mesExpiracion:  '',
    anioExpiracion: '',
    cvv:            '',
  };

  get tarjetaFormateada(): string {
    const n = this.form.numeroTarjeta.replace(/\D/g, '').slice(0, 16);
    return n.replace(/(.{4})/g, '$1 ').trim();
  }

  formatearTarjeta(event: any): void {
    const val = event.target.value.replace(/\D/g, '').slice(0, 16);
    this.form.numeroTarjeta = val;
    event.target.value = val.replace(/(.{4})/g, '$1 ').trim();
  }

  meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  anios = Array.from({length: 10}, (_, i) => String(new Date().getFullYear() + i));

  pagar(): void {
    if (this.procesando()) return;

    if (!this.form.numeroTarjeta || this.form.numeroTarjeta.length < 16) {
      this.error.set('Ingresa un número de tarjeta válido.');
      return;
    }
    if (!this.form.nombreTitular.trim()) {
      this.error.set('Ingresa el nombre del titular.');
      return;
    }
    if (!this.form.mesExpiracion || !this.form.anioExpiracion) {
      this.error.set('Ingresa la fecha de vencimiento.');
      return;
    }
    if (!this.form.cvv || this.form.cvv.length < 3) {
      this.error.set('Ingresa el CVV.');
      return;
    }

    this.procesando.set(true);
    this.error.set(null);

    const datos = {
      numeroTarjeta:  this.form.numeroTarjeta.slice(-4),
      nombreTitular:  this.form.nombreTitular,
      mesExpiracion:  this.form.mesExpiracion,
      anioExpiracion: this.form.anioExpiracion,
    };

    this.pagosService.pagarEnLinea(this.envioId()).subscribe({
      next: () => {
        this.exitoso.set(true);
        this.procesando.set(false);
        setTimeout(() => {
          this.pagado.emit();
          this.cerrar.emit();
        }, 2000);
      },
      error: () => {
        this.error.set('No se pudo procesar el pago. Intenta nuevamente.');
        this.procesando.set(false);
      }
    });
  }
}
