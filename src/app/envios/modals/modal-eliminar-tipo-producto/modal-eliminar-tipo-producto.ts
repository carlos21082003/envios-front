import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { TipoProductoDTO } from '../../../productos/models/tipo-producto';
import { TipoProductoService } from '../../../productos/service/tipo-producto-service';

@Component({
  selector: 'app-modal-eliminar-tipo-producto',
  imports: [CommonModule],
  templateUrl: './modal-eliminar-tipo-producto.html',
  styleUrl: './modal-eliminar-tipo-producto.css',
})
export class ModalEliminarTipoProducto {
  private tipoProductoService = inject(TipoProductoService);

  tipo        = input.required<TipoProductoDTO>();
  cerrar      = output<void>();
  actualizado = output<void>();

  eliminando = signal(false);
  error      = signal<string | null>(null);

  confirmar(): void {
    this.eliminando.set(true);
    this.tipoProductoService.eliminarTipoProducto(this.tipo().id!).subscribe({
      next: () => {
        this.actualizado.emit();
        this.eliminando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo eliminar el tipo de producto.');
        this.eliminando.set(false);
      }
    });
  }
}
