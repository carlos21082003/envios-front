import { Component, inject, OnInit, signal } from '@angular/core';
import { PagosService } from './service/pagos-service';
import { ModalEditarPagos } from "../envios/modals/modal-editar-pagos/modal-editar-pagos";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos',
  imports: [ModalEditarPagos, CommonModule, DatePipe, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos implements OnInit {

  private pagosService = inject(PagosService);

  pagos         = signal<any[]>([]);
  paginaActual  = signal<number>(0);
  totalPaginas  = signal<number>(0);
  totalElementos = signal<number>(0);
  cargando      = signal<boolean>(true);
  error         = signal<string | null>(null);

  // Modal
  modalPago         = signal(false);
  pagoSeleccionado  = signal<any>(null);

  // Stats computed
  totalPagado    = signal<number>(0);
  totalPendiente = signal<number>(0);
  totalEfectivo  = signal<number>(0);
  totalTransferencia = signal<number>(0);

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.pagosService.listarPagos(this.paginaActual(), 15).subscribe({
      next: (response) => {
        this.pagos.set(response.content);
        this.totalPaginas.set(response.totalPages);
        this.totalElementos.set(response.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de pagos.');
        this.cargando.set(false);
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
      this.cargarPagos();
    }
  }

  abrirModalPago(pago: any): void {
    this.pagoSeleccionado.set(pago);
    this.modalPago.set(true);
  }

  onActualizado(): void {
    this.cargarPagos();
  }

  badgeEstado(estado: string): string {
    return estado === 'PAGADO'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  }

  badgeMetodo(metodo: string): string {
    return metodo === 'EFECTIVO'
      ? 'bg-slate-100 text-slate-600'
      : 'bg-blue-100 text-blue-600';
  }
}
