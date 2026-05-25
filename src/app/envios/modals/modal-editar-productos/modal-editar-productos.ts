import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../productos/service/productos-service';
import { TipoProductoService } from '../../../productos/service/tipo-producto-service';
import { TipoProductoDTO } from '../../../productos/models/tipo-producto';
import { ProductosDTO } from '../../../productos/models/productos';

@Component({
  selector: 'app-modal-editar-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-productos.html',
  styleUrl: './modal-editar-productos.css',
})
export class ModalEditarProductos implements OnInit {
  private productosService    = inject(ProductosService);
  private tipoProductoService = inject(TipoProductoService);

  // Recibe la lista completa del envío
  productos   = input.required<ProductosDTO[]>();
  cerrar      = output<void>();
  actualizado = output<void>();

  tiposProducto = signal<TipoProductoDTO[]>([]);
  guardando     = signal(false);
  error         = signal<string | null>(null);

  // Copia local editable
  forms = signal<{ id: number; tipoProductoId: number; descripcion: string; numeroPaquetes: number }[]>([]);

  ngOnInit(): void {
    this.tipoProductoService.listarPaginado(0, 50).subscribe({
      next: (res) => this.tiposProducto.set(res.content),
      error: () => console.error('Error al cargar tipos de producto'),
    });

    // Inicializa el form con los productos recibidos
    this.forms.set(
      this.productos().map(p => ({
        id:             p.id!,
        tipoProductoId: p.tipoProductoId,
        descripcion:    p.descripcion,
        numeroPaquetes: p.numeroPaquetes,
      }))
    );
  }

  subtotal(form: { tipoProductoId: number; numeroPaquetes: number }): number {
    const tipo = this.tiposProducto().find(t => t.id === form.tipoProductoId);
    return (tipo?.precioBase ?? 0) * form.numeroPaquetes;
  }

  get totalEstimado(): number {
    return this.forms().reduce((acc, f) => acc + this.subtotal(f), 0);
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    // Actualiza cada producto en paralelo
    const peticiones = this.forms().map(f =>
      this.productosService.actualizarProducto(f.id, {
        tipoProductoId: f.tipoProductoId,
        descripcion:    f.descripcion,
        numeroPaquetes: f.numeroPaquetes,
      })
    );

    Promise.all(peticiones.map(p => p.toPromise()))
      .then(() => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      })
      .catch(() => {
        this.error.set('No se pudo actualizar uno o más productos.');
        this.guardando.set(false);
      });
  }
}
