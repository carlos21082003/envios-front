import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RutasService } from './service/rutas-service';
import { RutaSedeDTO } from './models/rutas';
import { SedeDTO } from '../sede/models/sede';
import { SedeService } from '../sede/service/sede-service';

@Component({
  selector: 'app-rutas',
  imports: [CommonModule, FormsModule],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css',
})
export class Rutas {
  private rutasService = inject(RutasService);
  private sedeService  = inject(SedeService);

  rutas          = signal<RutaSedeDTO[]>([]);
  sedes          = signal<SedeDTO[]>([]);
  cargando       = signal(false);
  guardando      = signal(false);
  errorMsg       = signal<string | null>(null);
  exitoso        = signal<string | null>(null);
  mostrarModal   = signal(false);

  paginaActual   = signal(0);
  totalPaginas   = signal(0);
  totalElementos = signal(0);
  readonly cantidad = 10;

  form = {
    sedeOrigenId:  0,
    sedeDestinoId: 0,
  };

  ngOnInit(): void {
    this.cargarRutas();
    this.cargarSedes();
  }

  cargarRutas(): void {
    this.cargando.set(true);
    this.rutasService.listar(this.paginaActual(), this.cantidad).subscribe({
      next: (res) => {
        this.rutas.set(res.content);
        this.totalPaginas.set(res.totalPages);
        this.totalElementos.set(res.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar las rutas.');
        this.cargando.set(false);
      }
    });
  }

  cargarSedes(): void {
    this.sedeService.listarActivas().subscribe({
      next: (sedes) => this.sedes.set(sedes),
      error: () => console.error('Error al cargar sedes')
    });
  }

  abrirModal(): void {
    this.form = { sedeOrigenId: 0, sedeDestinoId: 0 };
    this.errorMsg.set(null);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.errorMsg.set(null);
  }

  guardar(): void {
    if (!this.form.sedeOrigenId || !this.form.sedeDestinoId) {
      this.errorMsg.set('Debes seleccionar sede origen y destino.');
      return;
    }
    if (this.form.sedeOrigenId === this.form.sedeDestinoId) {
      this.errorMsg.set('La sede origen y destino no pueden ser la misma.');
      return;
    }

    this.guardando.set(true);
    this.errorMsg.set(null);

    this.rutasService.crear(this.form as RutaSedeDTO).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.mostrarExitoso('Ruta creada correctamente.');
        this.cargarRutas();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Ya existe una ruta activa entre estas sedes.');
        this.guardando.set(false);
      }
    });
  }

  cambiarEstado(ruta: RutaSedeDTO): void {
    const nuevoEstado = !ruta.activo;
    this.rutasService.cambiarEstado(ruta.id!, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExitoso(`Ruta ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
        this.cargarRutas();
      },
      error: () => this.errorMsg.set('Error al cambiar el estado de la ruta.')
    });
  }

  mostrarExitoso(msg: string): void {
    this.exitoso.set(msg);
    setTimeout(() => this.exitoso.set(null), 3000);
  }

  sedesFiltradas(): SedeDTO[] {
    return this.sedes().filter(s => s.id !== this.form.sedeOrigenId);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarRutas();
  }
}
