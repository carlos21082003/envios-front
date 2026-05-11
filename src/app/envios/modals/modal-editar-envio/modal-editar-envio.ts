import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoEnvio } from '../../models/estado-envio';
import { EnviosService } from '../../service/envios-service';

@Component({
  selector: 'app-modal-editar-envio',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-envio.html',
  styleUrl: './modal-editar-envio.css',
})
export class ModalEditarEnvio implements OnInit {
   private enviosService = inject(EnviosService);

  envioId     = input.required<number>();
  cerrar      = output<void>();
  actualizado = output<void>();

  EstadoEnvio = EstadoEnvio;
  guardando   = signal(false);
  cargando    = signal(true);
  error       = signal<string | null>(null);

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  form = {
    nombreRemitente:         '',
    dniRemitente:            '',
    nombreDestinatario:      '',
    dniDestinatario:         '',
    provincia:               '',
    horaSalida:              '',
    horaLlegada:             '',
    fechaEnvio:              '',
    estadoEnvio:             EstadoEnvio.PORSALIR,
    nombrePersonaAutorizada: '',
    dniPersonaAutorizada:    '',
  };

  ngOnInit(): void {
    this.enviosService.getEnvioById(this.envioId()).subscribe({
      next: (envio) => {
        this.form = {
          nombreRemitente:         envio.nombreRemitente,
          dniRemitente:            envio.dniRemitente,
          nombreDestinatario:      envio.nombreDestinatario,
          dniDestinatario:         envio.dniDestinatario,
          provincia:               envio.provincia,
          horaSalida:              envio.horaSalida,
          horaLlegada:             envio.horaLlegada,
          fechaEnvio:              envio.fechaEnvio?.slice(0, 16) ?? '',
          estadoEnvio:             envio.estadoEnvio,
          nombrePersonaAutorizada: envio.nombrePersonaAutorizada ?? '',
          dniPersonaAutorizada:    envio.dniPersonaAutorizada ?? '',
        };
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el envío.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    const dto = {
      ...this.form,
      fechaEnvio:              new Date(this.form.fechaEnvio).toISOString(),
      nombrePersonaAutorizada: this.form.nombrePersonaAutorizada || null,
      dniPersonaAutorizada:    this.form.dniPersonaAutorizada || null,
    };

    this.enviosService.actualizarEnvio(this.envioId(), dto).subscribe({
      next: () => {
        this.actualizado.emit();
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('No se pudo actualizar el envío.');
        this.guardando.set(false);
      }
    });
  }
}
