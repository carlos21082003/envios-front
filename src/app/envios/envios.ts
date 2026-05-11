import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { EnviosService } from './service/envios-service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalEditarEnvio } from "./modals/modal-editar-envio/modal-editar-envio";
import { ModalEditarPagos } from "./modals/modal-editar-pagos/modal-editar-pagos";
import { ModalEditarProductos } from "./modals/modal-editar-productos/modal-editar-productos";
import { EstadoEnvio } from './models/estado-envio';

@Component({
  selector: 'app-envios',
  imports: [RouterModule, CommonModule, DatePipe, RouterLink, ModalEditarEnvio, ModalEditarPagos, ModalEditarProductos],
  templateUrl: './envios.html',
  styleUrl: './envios.css',
})
export class Envios implements OnInit {
  private enviosService = inject(EnviosService);
  private router        = inject(Router);

  // Lista 
  envios        = signal<any[]>([]);
  paginaActual  = signal<number>(0);
  totalPaginas  = signal<number>(0);
  totalElementos = signal<number>(0);
  cargando      = signal<boolean>(true);
  errorBusqueda = signal<boolean>(false);

  // ── Stats computed 
  totalEnvios   = computed(() => this.totalElementos());
  enTransito    = computed(() => this.envios().filter(e => e.estadoEnvio === EstadoEnvio.ENTRANSITO).length);
  porSalir      = computed(() => this.envios().filter(e => e.estadoEnvio === EstadoEnvio.PORSALIR).length);
  entregados    = computed(() => this.envios().filter(e => e.estadoEnvio === EstadoEnvio.ENTREGADO).length);

  // Modales 
  modalEnvio    = signal(false);
  modalPago     = signal(false);
  modalProducto = signal(false);
  envioSeleccionado = signal<any>(null);

  ngOnInit(): void {
    this.cargarEnvios();
  }

  cargarEnvios(): void {
    this.cargando.set(true);
    this.errorBusqueda.set(false);

    this.enviosService.listarEnvios(this.paginaActual(), 15).subscribe({
      next: (response) => {
        this.envios.set(response.content);
        this.totalPaginas.set(response.totalPages);
        this.totalElementos.set(response.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.envios.set([]);
      }
    });
  }

  buscarPorDni(dni: string): void {
    const dniLimpio = dni.trim();
    if (!dniLimpio) {
      this.paginaActual.set(0);
      this.cargarEnvios();
      return;
    }
    this.cargando.set(true);
    this.errorBusqueda.set(false);
    this.enviosService.rastrearEnvio(dniLimpio).subscribe({
      next: (response) => {
        this.envios.set([response]);
        this.totalPaginas.set(1);
        this.totalElementos.set(1);
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: () => {
        this.envios.set([]);
        this.errorBusqueda.set(true);
        this.cargando.set(false);
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
      this.cargarEnvios();
    }
  }

  verEnvio(id: number): void {
    this.router.navigate(['/envios/ver', id]);
  }

  // ── Badge estado ───────────────────────────
  badgeClase(estado: EstadoEnvio): string {
    const clases: Record<string, string> = {
      [EstadoEnvio.ENTRANSITO]: 'bg-black text-white',
      [EstadoEnvio.PORSALIR]:   'bg-slate-100 text-slate-600',
      [EstadoEnvio.ENTREGADO]:  'bg-green-100 text-green-700',
      [EstadoEnvio.SALIO]:      'bg-blue-100 text-blue-700',
    };
    return clases[estado] ?? 'bg-slate-100 text-slate-500';
  }

  badgeTexto(estado: EstadoEnvio): string {
    const textos: Record<string, string> = {
      [EstadoEnvio.ENTRANSITO]: 'En tránsito',
      [EstadoEnvio.PORSALIR]:   'Por salir',
      [EstadoEnvio.ENTREGADO]:  'Entregado',
      [EstadoEnvio.SALIO]:      'Salió',
    };
    return textos[estado] ?? estado;
  }

  // ── Modales ────────────────────────────────
  abrirModalEnvio(envio: any): void {
    this.envioSeleccionado.set(envio);
    this.modalEnvio.set(true);
  }

  abrirModalPago(envio: any): void {
    this.envioSeleccionado.set(envio);
    this.modalPago.set(true);
  }

  abrirModalProducto(envio: any): void {
    this.envioSeleccionado.set(envio);
    this.modalProducto.set(true);
  }

  onActualizado(): void {
    this.cargarEnvios();
  }
}
