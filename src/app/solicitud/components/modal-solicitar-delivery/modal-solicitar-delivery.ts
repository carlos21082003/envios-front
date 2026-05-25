import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../service/solicitud-service';
import { SedeDTO } from '../../../sede/models/sede';
import { TipoSolicitud } from '../../models/solicitud';

@Component({
  selector: 'app-modal-solicitar-delivery',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-solicitar-delivery.html',
  styleUrl: './modal-solicitar-delivery.css',
})
export class ModalSolicitarDelivery implements OnInit {
  private solicitudService = inject(SolicitudService);

  @Input() sedes: SedeDTO[]            = [];
  @Input() sedeIdActual: number | null = null;

  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar   = new EventEmitter<void>();

  guardando = signal(false);
  errorMsg  = signal<string | null>(null);

  sedesConDelivery: SedeDTO[] = [];

  form = {
    nombreSolicitante:   '',
    dniSolicitante:      '',
    telefono:            '',
    direccion:           '',
    referencia:          '',
    codigoEnvio:         '',          
    nombrePersonaRecibe: '',
    dniPersonaRecibe:    '',
    sedeId:              0,
  };

  ngOnInit(): void {
    this.sedesConDelivery = this.sedes.filter(s => s.tieneDelivery);
    if (this.sedeIdActual) this.form.sedeId = this.sedeIdActual;
  }

  guardar(): void {
    if (!this.form.nombreSolicitante || !this.form.dniSolicitante ||
        !this.form.telefono || !this.form.direccion || !this.form.sedeId) {
      this.errorMsg.set('Completa todos los campos obligatorios.');
      return;
    }
    if (!this.form.codigoEnvio || this.form.codigoEnvio.trim().length !== 6) {
      this.errorMsg.set('Ingresa el código de envío de 6 dígitos.');
      return;
    }

    this.guardando.set(true);
    this.errorMsg.set(null);

    const dto = { ...this.form, tipo: TipoSolicitud.DELIVERY };

    this.solicitudService.solicitarDelivery(dto as any).subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Error al registrar la solicitud.');
        this.guardando.set(false);
      }
    });
  }

  onCerrar(): void { this.cerrar.emit(); }
}
