import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TipoProductoService } from './service/tipo-producto-service';
import { TipoProductoDTO } from './models/tipo-producto';
import { FormsModule } from '@angular/forms';
import { ModalAgregarTipoProducto } from "../envios/modals/modal-agregar-tipo-producto/modal-agregar-tipo-producto";
import { ModalEliminarTipoProducto } from "../envios/modals/modal-eliminar-tipo-producto/modal-eliminar-tipo-producto";
import { ModalEditarTipoProducto } from "../envios/modals/modal-editar-tipo-producto/modal-editar-tipo-producto";

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, ModalAgregarTipoProducto, ModalEliminarTipoProducto, ModalEditarTipoProducto],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  private tipoProductoService = inject(TipoProductoService);

  tiposProducto  = signal<TipoProductoDTO[]>([]);
  cargando       = signal(false);
  paginaActual   = signal(0);
  totalPaginas   = signal(0);
  totalElementos = signal(0);
  mostrarTodos   = signal(false);
  readonly cantidad = 15;

  modalAgregar     = signal(false);
  modalEditar      = signal(false);
  modalEliminar    = signal(false);
  tipoSeleccionado = signal<TipoProductoDTO | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const soloActivosFiltro = !this.mostrarTodos(); 
  
    this.tipoProductoService.listarPaginado(this.paginaActual(), this.cantidad, soloActivosFiltro)
      .subscribe({
        next: (res) => {
          this.tiposProducto.set(res.content);
          this.totalPaginas.set(res.totalPages);
          this.totalElementos.set(res.totalElements);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false)
      });
  }
  
  toggleMostrarTodos(): void {
    this.mostrarTodos.update(v => !v);
    this.paginaActual.set(0); 
    this.cargar();
  }

  abrirEditar(tipo: TipoProductoDTO): void {
    console.log('Editando tipo:', tipo);
    this.tipoSeleccionado.set(tipo);
    this.modalEditar.set(true);
  }

  abrirEliminar(tipo: TipoProductoDTO): void {
    this.tipoSeleccionado.set(tipo);
    this.modalEliminar.set(true);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  onActualizado(): void {
    this.cargar();
  }
}
