import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../service/solicitud-service';
import { SedeService } from '../../sede/service/sede-service';
import { EstadoSolicitud, SolicitudDTO, TipoSolicitud } from '../models/solicitud';
import { SedeDTO } from '../../sede/models/sede';
import { ModalSolicitarRecojo } from "../components/modal-solicitar-recojo/modal-solicitar-recojo";
import { ModalSolicitarDelivery } from "../components/modal-solicitar-delivery/modal-solicitar-delivery";


@Component({
  selector: 'app-solicitud-usuario',
  imports: [FormsModule, CommonModule, ModalSolicitarRecojo, ModalSolicitarDelivery],
  templateUrl: './solicitud-usuario.html',
  styleUrl: './solicitud-usuario.css',
})
export class SolicitudUsuario implements OnInit {
  private solicitudService = inject(SolicitudService);
  private sedeService      = inject(SedeService);

  TipoSolicitud   = TipoSolicitud;
  EstadoSolicitud = EstadoSolicitud;

  sedes = signal<SedeDTO[]>([]);

  // paso: 'inicio' | 'exito' | 'busqueda'
  paso = signal<'inicio' | 'exito' | 'busqueda'>('inicio');

  mostrarModalRecojo   = signal(false);
  mostrarModalDelivery = signal(false);
  solicitudCreada      = signal<SolicitudDTO | null>(null);

  // rastreo por DNI
  dniBusqueda        = signal('');
  buscando           = signal(false);
  solicitudesCliente = signal<SolicitudDTO[]>([]);
  errorBusqueda      = signal<string | null>(null);

  ngOnInit(): void {
    this.sedeService.listarActivas().subscribe({
      next: (sedes) => this.sedes.set(sedes),
    });
  }

  onGuardadoRecojo(solicitud?: SolicitudDTO): void {
    this.mostrarModalRecojo.set(false);
    this.solicitudCreada.set(solicitud ?? null);
    this.paso.set('exito');
  }

  onGuardadoDelivery(solicitud?: SolicitudDTO): void {
    this.mostrarModalDelivery.set(false);
    this.solicitudCreada.set(solicitud ?? null);
    this.paso.set('exito');
  }

  nuevaSolicitud(): void {
    this.paso.set('inicio');
    this.solicitudCreada.set(null);
  }

  irABusqueda(): void {
    this.paso.set('busqueda');
    this.solicitudesCliente.set([]);
    this.errorBusqueda.set(null);
    this.dniBusqueda.set('');
  }

  buscarSolicitudes(): void {
    const dni = this.dniBusqueda().trim();
    if (!dni || dni.length !== 8) {
      this.errorBusqueda.set('Ingresa un DNI válido de 8 dígitos.');
      return;
    }
    this.buscando.set(true);
    this.errorBusqueda.set(null);
    this.solicitudService.listarPorDni(dni).subscribe({
      next: (res) => {
        this.solicitudesCliente.set(res.content);
        if (res.content.length === 0) {
          this.errorBusqueda.set('No se encontraron solicitudes para ese DNI.');
        }
        this.buscando.set(false);
      },
      error: () => {
        this.errorBusqueda.set('No se encontraron solicitudes para ese DNI.');
        this.buscando.set(false);
      }
    });
  }

  badgeEstadoClase(estado: EstadoSolicitud): string {
    const c: Record<string, string> = {
      [EstadoSolicitud.PENDIENTE]:  'bg-slate-100 text-slate-600 border border-slate-200',
      [EstadoSolicitud.ACEPTADA]:   'bg-slate-800 text-white border border-slate-800',
      [EstadoSolicitud.COMPLETADA]: 'bg-black text-white border border-black',
      [EstadoSolicitud.RECHAZADA]:  'bg-red-50 text-red-700 border border-red-100',
    };
    return c[estado] ?? 'bg-slate-100 text-slate-500';
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
}
