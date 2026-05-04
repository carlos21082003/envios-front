import { Component, inject, input, output, signal } from '@angular/core';
import { TipoProductoService } from '../../../productos/service/tipo-producto-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-editar-tipo-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-tipo-producto.html',
  styleUrl: './modal-editar-tipo-producto.css',
})
export class ModalEditarTipoProducto {
   private tipoProductoService = inject(TipoProductoService);

  tipoId      = input.required<number>();
  cerrar      = output<void>();
  actualizado = output<void>();

  guardando = signal(false);
  cargando  = signal(true);
  error     = signal<string | null>(null);

  form = { nombre: '', precioBase: 0, descripcion: '' };

  ngOnInit(): void {
    this.tipoProductoService.getTipoProductoById(this.tipoId()).subscribe({
      next: (tipo) => {
        this.form = {
          nombre:      tipo.nombre,
          precioBase:  tipo.precioBase,
          descripcion: tipo.descripcion,
        };
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el tipo de producto.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    this.tipoProductoService.actualizarTipoProducto(this.tipoId(), this.form).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo actualizar el tipo de producto.');
        this.guardando.set(false);
      }
    });
  }
}
