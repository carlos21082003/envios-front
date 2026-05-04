import { Component, inject, signal } from '@angular/core';
import { EstadoEnvio } from '../models/estado-envio';
import { ActivatedRoute, Router } from '@angular/router';
import { EnviosService } from '../service/envios-service';
import { EstadoPago } from '../../pagos/models/estado-pago';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoProductoService } from '../../productos/service/tipo-producto-service';
import { TipoProductoDTO } from '../../productos/models/tipo-producto';

@Component({
  selector: 'app-agregar-envio',
  imports: [FormsModule,CommonModule],
  templateUrl: './agregar-envio.html',
  styleUrl: './agregar-envio.css',
})
export class AgregarEnvio {
 private enviosService       = inject(EnviosService);
  private router              = inject(Router);
  private tipoProductoService = inject(TipoProductoService);
  private route               = inject(ActivatedRoute);

  tiposProducto = signal<TipoProductoDTO[]>([]);
  guardando     = signal(false);
  cargando      = signal(false);
  errorGuardar  = signal<string | null>(null);
  exitoso       = signal(false);
  modoVer       = signal(false);
  envioId       = signal<number | null>(null);

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
      tipoProductoId:  0,
      descripcion:     '',
      numeroPaquetes:  1,
    },
    pago: {
      monto:      0,      // ← existe para que TypeScript no se queje y para mostrarlo en el resumen
      metodoPago: '',
      fechaPago:  '',
      estadoPago: EstadoPago.PAGADO,
    }
  };

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  ngOnInit(): void {
    this.cargarTiposProducto();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoVer.set(true);
      this.envioId.set(Number(id));
      this.cargarEnvio(Number(id));
    }
  }

  cargarTiposProducto(): void {
    this.tipoProductoService.listarPaginado(0, 50, true).subscribe({
      next: (res) => {
        console.log('Tipos activos recibidos:', res.content); 
        this.tiposProducto.set(res.content);
      },
      error: () => console.error('Error al cargar tipos de producto')
    });
  }

  cargarEnvio(id: number): void {
    this.cargando.set(true);
    this.enviosService.getEnvioById(id).subscribe({
      next: (envio) => {
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
            tipoProductoId:  envio.producto.tipoProductoId,
            descripcion:     envio.producto.descripcion,
            numeroPaquetes:  envio.producto.numeroPaquetes,
          },
          pago: {
            monto:      envio.pago.monto,   // ← viene del back al cargar
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

    // monto NO se manda al back, lo calcula el servidor
    const dto = {
      ...this.form,
      fechaEnvio: new Date(this.form.fechaEnvio).toISOString(),
      pago: {
        metodoPago: this.form.pago.metodoPago,
        fechaPago:  new Date(this.form.pago.fechaPago).toISOString(),
        estadoPago: this.form.pago.estadoPago,
      }
    };

    this.enviosService.guardarEnvio(dto).subscribe({
      next: (envioGuardado) => {
        // actualizar el monto con el valor calculado que devuelve el back
        this.form.pago.monto = envioGuardado.pago.monto;
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
