import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoPago } from '../../../pagos/models/estado-pago';
import { PagosService } from '../../../pagos/service/pagos-service';

@Component({
  selector: 'app-modal-editar-pagos',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-pagos.html',
  styleUrl: './modal-editar-pagos.css',
})
export class ModalEditarPagos implements OnInit {
  private pagosService = inject(PagosService);

   pagoId      = input.required<number>();
  cerrar      = output<void>();
  actualizado = output<void>();

  EstadoPago = EstadoPago;
  guardando  = signal(false);
  cargando   = signal(true);
  error      = signal<string | null>(null);

  montoActual = signal<number>(0);

  form = {
    metodoPago: '',
    fechaPago:  '',
    estadoPago: EstadoPago.PAGADO,
  };

  ngOnInit(): void {
    this.pagosService.getPagoById(this.pagoId()).subscribe({
      next: (pago) => {
        this.montoActual.set(pago.monto); 
        this.form = {
          metodoPago: pago.metodoPago,
          fechaPago:  pago.fechaPago?.slice(0, 16),
          estadoPago: pago.estadoPago,
        };
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el pago.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    const dto = {
      ...this.form,
      fechaPago: new Date(this.form.fechaPago).toISOString(),
    };

    this.pagosService.actualizarPago(this.pagoId(), dto).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo actualizar el pago.');
        this.guardando.set(false);
      }
    });
  }
}
