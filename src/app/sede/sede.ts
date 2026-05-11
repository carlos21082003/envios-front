import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SedeDTO } from './models/sede';
import { SedeService } from './service/sede-service';
import { ModalAgregarSede } from "./components/modal-agregar-sede/modal-agregar-sede";
import { ModalDesactivarSede } from "./components/modal-desactivar-sede/modal-desactivar-sede";

@Component({
  selector: 'app-sede',
  imports: [FormsModule, CommonModule, ModalAgregarSede, ModalDesactivarSede],
  templateUrl: './sede.html',
  styleUrl: './sede.css',
})
export class Sede {
 private sedeService = inject(SedeService);

  sedes          = signal<SedeDTO[]>([]);
  cargando       = signal(false);
  errorMsg       = signal<string | null>(null);
  exitoso        = signal(false);
  mostrarModal   = signal(false);
  modoEditar     = signal(false);
  sedeSeleccionada = signal<SedeDTO | null>(null);
  mostrarModalDesactivar = signal(false);
  sedeADesactivar        = signal<SedeDTO | null>(null);

  paginaActual   = signal(0);
  totalPaginas   = signal(0);
  totalElementos = signal(0);
  readonly cantidad = 10;

  ngOnInit(): void {
    this.cargarSedes();
  }

  cargarSedes(): void {
    this.cargando.set(true);
    this.sedeService.listarTodas(this.paginaActual(), this.cantidad).subscribe({
      next: (res) => {
        this.sedes.set(res.content);
        this.totalPaginas.set(res.totalPages);
        this.totalElementos.set(res.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar las sedes.');
        this.cargando.set(false);
      }
    });
  }

  abrirModalNueva(): void {
    this.sedeSeleccionada.set(null);
    this.modoEditar.set(false);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(sede: SedeDTO): void {
    this.sedeSeleccionada.set({ ...sede });
    this.modoEditar.set(true);
    this.mostrarModal.set(true);
  }

  onGuardado(): void {
    this.mostrarModal.set(false);
    this.exitoso.set(true);
    this.cargarSedes();
    setTimeout(() => this.exitoso.set(false), 3000);
  }

  onCerrar(): void {
    this.mostrarModal.set(false);
  }

  abrirModalEstado(sede: SedeDTO): void {
    this.sedeADesactivar.set(sede);
    this.mostrarModalDesactivar.set(true);
  }

  onConfirmado(): void {
    this.mostrarModalDesactivar.set(false);
    this.exitoso.set(true);
    this.cargarSedes();
    setTimeout(() => this.exitoso.set(false), 3000);
  }

  onCerrarDesactivar(): void {
    this.mostrarModalDesactivar.set(false);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarSedes();
  }
}
