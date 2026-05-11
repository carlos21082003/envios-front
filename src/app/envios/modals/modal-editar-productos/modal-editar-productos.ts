import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../productos/service/productos-service';
import { TipoProductoService } from '../../../productos/service/tipo-producto-service';
import { TipoProductoDTO } from '../../../productos/models/tipo-producto';

@Component({
  selector: 'app-modal-editar-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-productos.html',
  styleUrl: './modal-editar-productos.css',
})
export class ModalEditarProductos implements OnInit {
  private productosService    = inject(ProductosService);
  private tipoProductoService = inject(TipoProductoService);

  productoId  = input.required<number>();
  cerrar      = output<void>();
  actualizado = output<void>();

  tiposProducto = signal<TipoProductoDTO[]>([]);
  guardando     = signal(false);
  cargando      = signal(true);
  error         = signal<string | null>(null);

  form = {
    tipoProductoId: 0,
    descripcion:    '',
    numeroPaquetes: 1,
  };

  ngOnInit(): void {
    // carga tipos activos para el select
    this.tipoProductoService.listarPaginado(0, 50, true).subscribe({
      next: (res) => this.tiposProducto.set(res.content),
      error: () => console.error('Error al cargar tipos de producto')
    });

    // carga el producto actual
    this.productosService.getProductoById(this.productoId()).subscribe({
      next: (producto) => {
        this.form = {
          tipoProductoId: producto.tipoProductoId,
          descripcion:    producto.descripcion,
          numeroPaquetes: producto.numeroPaquetes,
        };
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el producto.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    this.productosService.actualizarProducto(this.productoId(), this.form).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo actualizar el producto.');
        this.guardando.set(false);
      }
    });
  }
}
