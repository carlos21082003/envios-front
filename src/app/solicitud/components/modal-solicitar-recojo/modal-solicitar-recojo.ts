import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoSolicitud } from '../../models/solicitud';
import { SolicitudService } from '../../service/solicitud-service';
import { SedeDTO } from '../../../sede/models/sede';


@Component({
  selector: 'app-modal-solicitar-recojo',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-solicitar-recojo.html',
  styleUrl: './modal-solicitar-recojo.css',
})
export class ModalSolicitarRecojo implements OnInit {
  private solicitudService = inject(SolicitudService);

  @Input() sedes: SedeDTO[]            = [];
  @Input() sedeIdActual: number | null = null;

  @Output() guardado = new EventEmitter<void>();
  @Output() cerrar   = new EventEmitter<void>();

  guardando = signal(false);
  errorMsg  = signal<string | null>(null);

  sedesConRecojo: SedeDTO[] = [];
  sedesDestino:   SedeDTO[] = [];

  form = {
    nombreSolicitante:   '',
    dniSolicitante:      '',
    telefono:            '',
    direccion:           '',
    referencia:          '',
    descripcionProducto: '',
    nombrePersonaRecibe: '',
    dniPersonaRecibe:    '',
    sedeId:              0,
    sedeDestinoId:       0,
    nombreDestinatario:  '',
    dniDestinatario:     '',
    provinciaDestino:    '',
  };

  ngOnInit(): void {
    this.sedesConRecojo = this.sedes.filter(s => s.tieneRecojo);
    this.sedesDestino   = this.sedes;
    if (this.sedeIdActual) this.form.sedeId = this.sedeIdActual;
  }

  sedesDestinoFiltradas(): SedeDTO[] {
    return this.sedesDestino.filter(s => s.id !== this.form.sedeId);
  }

  guardar(): void {
    if (!this.form.nombreSolicitante || !this.form.dniSolicitante ||
        !this.form.telefono || !this.form.direccion || !this.form.sedeId) {
      this.errorMsg.set('Completa todos los campos obligatorios.');
      return;
    }

    this.guardando.set(true);
    this.errorMsg.set(null);

    const dto = {
      ...this.form,
      tipo: TipoSolicitud.RECOJO,
      sedeDestinoId: this.form.sedeDestinoId || undefined,
    };

    this.solicitudService.solicitarRecojo(dto as any).subscribe({
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
