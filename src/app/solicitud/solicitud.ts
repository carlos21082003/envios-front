import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from './service/solicitud-service';
import { SedeService } from '../sede/service/sede-service';
import { CompletarSolicitudDTO, EstadoSolicitud, SolicitudDTO, TipoSolicitud } from './models/solicitud';
import { SedeDTO } from '../sede/models/sede';
import { ModalSolicitarRecojo } from "./components/modal-solicitar-recojo/modal-solicitar-recojo";
import { ModalSolicitarDelivery } from "./components/modal-solicitar-delivery/modal-solicitar-delivery";
import { TipoProductoService } from '../productos/service/tipo-producto-service';
import { TipoProductoDTO } from '../productos/models/tipo-producto';

@Component({
  selector: 'app-solicitud',
  imports: [FormsModule, CommonModule, ModalSolicitarRecojo, ModalSolicitarDelivery],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud {
 private solicitudService   = inject(SolicitudService);
  private sedeService        = inject(SedeService);
  private tipoProductoService = inject(TipoProductoService);

  solicitudes    = signal<SolicitudDTO[]>([]);
  sedes          = signal<SedeDTO[]>([]);
  tiposProducto  = signal<TipoProductoDTO[]>([]);
  cargando       = signal(false);
  errorMsg       = signal<string | null>(null);
  exitoso        = signal<string | null>(null);

  sedeSeleccionada = signal<number | null>(null);
  estadoFiltro     = signal<EstadoSolicitud | 'TODOS'>('TODOS');

  paginaActual   = signal(0);
  totalPaginas   = signal(0);
  totalElementos = signal(0);
  readonly cantidad = 15;

  totalPendientes  = signal(0);
  totalAceptadas   = signal(0);
  totalCompletadas = signal(0);
  totalRechazadas  = signal(0);

  // modal rechazo
  mostrarModalRechazo  = signal(false);
  solicitudArechazar   = signal<SolicitudDTO | null>(null);
  motivoRechazo        = signal('');
  procesando           = signal(false);

  // modal completar recojo
  mostrarModalCompletar  = signal(false);
  solicitudACompletar    = signal<SolicitudDTO | null>(null);
  guardandoCompletar     = signal(false);
  errorCompletar         = signal<string | null>(null);

  completarForm: CompletarSolicitudDTO = this.completarFormVacio();

  // modales crear
  mostrarModalRecojo   = signal(false);
  mostrarModalDelivery = signal(false);

  EstadoSolicitud = EstadoSolicitud;
  TipoSolicitud   = TipoSolicitud;

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  ngOnInit(): void {
    this.cargarSedes();
    this.cargarTiposProducto();
  }

  completarFormVacio(): CompletarSolicitudDTO {
    return {
      horaSalida:     '',
      horaLlegada:    '',
      tipoProductoId: 0,
      numeroPaquetes: 1,
      peso:           0,   
      volumen:        0,   
      metodoPago:     '',
      estadoPago:     'PAGADO',
    };
  }

  cargarSedes(): void {
    this.sedeService.listarActivas().subscribe({
      next: (sedes) => {
        this.sedes.set(sedes);
        if (sedes.length > 0) {
          this.sedeSeleccionada.set(sedes[0].id!);
          this.cargarSolicitudes();
          this.cargarTotales();
        }
      },
      error: () => this.errorMsg.set('Error al cargar sedes.')
    });
  }

  cargarTiposProducto(): void {
    this.tipoProductoService.listarPaginado(0, 50, true).subscribe({
      next: (res) => this.tiposProducto.set(res.content),
      error: () => console.error('Error al cargar tipos de producto')
    });
  }

  cargarSolicitudes(): void {
    const sedeId = this.sedeSeleccionada();
    if (!sedeId) return;
    this.cargando.set(true);
    this.errorMsg.set(null);

    const estado = this.estadoFiltro();
    const obs = estado === 'TODOS'
      ? this.solicitudService.listarPorSede(sedeId, this.paginaActual(), this.cantidad)
      : this.solicitudService.listarPorSedeYEstado(sedeId, estado as EstadoSolicitud, this.paginaActual(), this.cantidad);

    obs.subscribe({
      next: (res) => {
        this.solicitudes.set(res.content);
        this.totalPaginas.set(res.totalPages);
        this.totalElementos.set(res.totalElements);
        this.cargando.set(false);
      },
      error: () => { this.errorMsg.set('Error al cargar solicitudes.'); this.cargando.set(false); }
    });
  }

  cargarTotales(): void {
    const sedeId = this.sedeSeleccionada();
    if (!sedeId) return;
    [EstadoSolicitud.PENDIENTE, EstadoSolicitud.ACEPTADA,
     EstadoSolicitud.COMPLETADA, EstadoSolicitud.RECHAZADA].forEach(estado => {
      this.solicitudService.listarPorSedeYEstado(sedeId, estado, 0, 1).subscribe({
        next: (res) => {
          if (estado === EstadoSolicitud.PENDIENTE)  this.totalPendientes.set(res.totalElements);
          if (estado === EstadoSolicitud.ACEPTADA)   this.totalAceptadas.set(res.totalElements);
          if (estado === EstadoSolicitud.COMPLETADA) this.totalCompletadas.set(res.totalElements);
          if (estado === EstadoSolicitud.RECHAZADA)  this.totalRechazadas.set(res.totalElements);
        }
      });
    });
  }

  onCambiarSede(sedeId: number): void {
    this.sedeSeleccionada.set(Number(sedeId));
    this.paginaActual.set(0);
    this.cargarSolicitudes();
    this.cargarTotales();
  }

  onCambiarFiltro(estado: string): void {
    this.estadoFiltro.set(estado as EstadoSolicitud | 'TODOS');
    this.paginaActual.set(0);
    this.cargarSolicitudes();
  }

  aceptar(id: number): void {
    this.solicitudService.aceptar(id).subscribe({
      next: () => { this.mostrarExitoso('Solicitud aceptada.'); this.recargar(); },
      error: () => this.errorMsg.set('Error al aceptar.')
    });
  }

  // completar según tipo
  iniciarCompletar(solicitud: SolicitudDTO): void {
    if (solicitud.tipo === TipoSolicitud.DELIVERY) {
      this.solicitudService.completarDelivery(solicitud.id!).subscribe({
        next: () => { this.mostrarExitoso('Solicitud completada.'); this.recargar(); },
        error: () => this.errorMsg.set('Error al completar.')
      });
    } else {
      this.solicitudACompletar.set(solicitud);
      this.completarForm = this.completarFormVacio();
      this.errorCompletar.set(null);
      this.mostrarModalCompletar.set(true);
    }
  }

  confirmarCompletar(): void {
    const solicitud = this.solicitudACompletar();
    if (!solicitud?.id) return;
    
    // ACTUALIZADO: ya no valida destinatario ni provincia (vienen del recojo)
    if (!this.completarForm.tipoProductoId || !this.completarForm.metodoPago) {
      this.errorCompletar.set('Selecciona el tipo de producto y método de pago.');
      return;
    }
  
    this.guardandoCompletar.set(true);
    this.errorCompletar.set(null);
  
    this.solicitudService.completarRecojo(solicitud.id, this.completarForm).subscribe({
      next: () => {
        this.guardandoCompletar.set(false);
        this.mostrarModalCompletar.set(false);
        this.mostrarExitoso('Solicitud completada. El envío fue creado automáticamente.');
        this.recargar();
      },
      error: (err) => {
        this.errorCompletar.set(err?.error?.message ?? 'Error al completar la solicitud.');
        this.guardandoCompletar.set(false);
      }
    });
  }
  abrirModalRechazo(solicitud: SolicitudDTO): void {
    this.solicitudArechazar.set(solicitud);
    this.motivoRechazo.set('');
    this.mostrarModalRechazo.set(true);
  }

  cerrarModalRechazo(): void { this.mostrarModalRechazo.set(false); }

  confirmarRechazo(): void {
    const solicitud = this.solicitudArechazar();
    if (!solicitud?.id) return;
    this.procesando.set(true);
    this.solicitudService.rechazar(solicitud.id, this.motivoRechazo()).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cerrarModalRechazo();
        this.mostrarExitoso('Solicitud rechazada.');
        this.recargar();
      },
      error: () => { this.procesando.set(false); this.errorMsg.set('Error al rechazar.'); }
    });
  }

  onGuardado(): void {
    this.mostrarModalRecojo.set(false);
    this.mostrarModalDelivery.set(false);
    this.mostrarExitoso('Solicitud registrada correctamente.');
    this.recargar();
  }

  recargar(): void {
    this.cargarSolicitudes();
    this.cargarTotales();
  }

  mostrarExitoso(msg: string): void {
    this.exitoso.set(msg);
    setTimeout(() => this.exitoso.set(null), 3000);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarSolicitudes();
  }

  badgeEstadoClase(estado: EstadoSolicitud): string {
    const c: Record<string, string> = {
      [EstadoSolicitud.PENDIENTE]:  'bg-slate-100 text-slate-600 border-slate-200',
      [EstadoSolicitud.ACEPTADA]:   'bg-slate-800 text-white border-slate-800',
      [EstadoSolicitud.COMPLETADA]: 'bg-black text-white border-black',
      [EstadoSolicitud.RECHAZADA]:  'bg-red-50 text-red-700 border-red-100',
    };
    return c[estado] ?? 'bg-slate-100 text-slate-500 border-slate-200';
  }

  badgeEstadoTexto(estado: EstadoSolicitud): string {
    const t: Record<string, string> = {
      [EstadoSolicitud.PENDIENTE]:  'Pendiente',
      [EstadoSolicitud.ACEPTADA]:   'Aceptada',
      [EstadoSolicitud.COMPLETADA]: 'Completada',
      [EstadoSolicitud.RECHAZADA]:  'Rechazada',
    };
    return t[estado] ?? estado;
  }

  badgeTipoClase(tipo: TipoSolicitud): string {
    return tipo === TipoSolicitud.RECOJO
      ? 'bg-slate-100 text-slate-700 border-slate-200'
      : 'bg-slate-900 text-white border-slate-900';
  }

  badgeTipoIcono(tipo: TipoSolicitud): string {
    return tipo === TipoSolicitud.RECOJO ? 'fa-box' : 'fa-motorcycle';
  }
}
