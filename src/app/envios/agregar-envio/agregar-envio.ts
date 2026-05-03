import { Component, inject, signal } from '@angular/core';
import { EstadoEnvio } from '../models/estado-envio';
import { ActivatedRoute, Router } from '@angular/router';
import { EnviosService } from '../service/envios-service';
import { EstadoPago } from '../../pagos/models/estado-pago';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-envio',
  imports: [FormsModule,CommonModule],
  templateUrl: './agregar-envio.html',
  styleUrl: './agregar-envio.css',
})
export class AgregarEnvio {
  private enviosService = inject(EnviosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  guardando  = signal(false);
  cargando   = signal(false);
  errorGuardar = signal<string | null>(null);
  exitoso    = signal(false);

  //  Modo del formulario 
  modoVer  = signal(false); 
  envioId  = signal<number | null>(null);

  EstadoEnvio = EstadoEnvio;
  EstadoPago  = EstadoPago;

  form = {
    nombreRemitente:    '',
    dniRemitente:       '',
    nombreDestinatario: '',
    dniDestinatario:    '',
    provincia:          '',
    horaSalida:         '',
    horaLlegada:        '',
    fechaEnvio:         '',
    estadoEnvio:        EstadoEnvio.PORSALIR,
    producto: {
      tipoProducto:   '',
      descripcion:    '',
      numeroPaquetes: 1,
    },
    pago: {
      monto:       0,
      metodoPago:  '',
      fechaPago:   '',
      estadoPago:  EstadoPago.PAGADO,
    }
  };

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); 

    if (id) {
      this.modoVer.set(true);
      this.envioId.set(Number(id));
      this.cargarEnvio(Number(id));
    }
  }

  cargarEnvio(id: number): void {
    this.cargando.set(true);

    this.enviosService.getEnvioById(id).subscribe({
      next: (envio) => {
        // Rellenar el formulario con los datos del envío
        this.form = {
          nombreRemitente:    envio.nombreRemitente,
          dniRemitente:       envio.dniRemitente,
          nombreDestinatario: envio.nombreDestinatario,
          dniDestinatario:    envio.dniDestinatario,
          provincia:          envio.provincia,
          horaSalida:         envio.horaSalida,
          horaLlegada:        envio.horaLlegada,
          fechaEnvio:         envio.fechaEnvio?.slice(0, 16), 
          estadoEnvio:        envio.estadoEnvio,
          producto: {
            tipoProducto:   envio.producto.tipoProducto,
            descripcion:    envio.producto.descripcion,
            numeroPaquetes: envio.producto.numeroPaquetes,
          },
          pago: {
            monto:      envio.pago.monto,
            metodoPago: envio.pago.metodoPago,
            fechaPago:  envio.pago.fechaPago?.slice(0, 16),
            estadoPago: envio.pago.estadoPago,
          }
        };
        this.cargando.set(false);
      },
      error: () => {
        this.errorGuardar.set('No se pudo cargar el envío.');
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (this.modoVer()) return;

    this.guardando.set(true);
    this.errorGuardar.set(null);

    const dto = {
      ...this.form,
      fechaEnvio: new Date(this.form.fechaEnvio).toISOString(),
      pago: {
        ...this.form.pago,
        fechaPago: new Date(this.form.pago.fechaPago).toISOString(),
      }
    };

    this.enviosService.guardarEnvio(dto).subscribe({
      next: () => {
        this.exitoso.set(true);
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/envios']), 1500);
      },
      error: () => {
        this.errorGuardar.set('Ocurrió un error al guardar el envío.');
        this.guardando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/envios']);
  }
}
