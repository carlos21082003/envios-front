import { Component, inject, output, signal } from '@angular/core';
import { TipoProductoService } from '../../../productos/service/tipo-producto-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-agregar-tipo-producto',
  imports: [CommonModule,FormsModule],
  templateUrl: './modal-agregar-tipo-producto.html',
  styleUrl: './modal-agregar-tipo-producto.css',
})
export class ModalAgregarTipoProducto {
  private tipoProductoService = inject(TipoProductoService);

  cerrar      = output<void>();
  actualizado = output<void>();

  guardando = signal(false);
  error     = signal<string | null>(null);

  form = { nombre: '', precioBase: 0, descripcion: '' };

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    this.tipoProductoService.guardarTipoProducto(this.form).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo guardar el tipo de producto.');
        this.guardando.set(false);
      }
    });
  }
}
