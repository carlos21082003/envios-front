import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoPago } from '../../pagos/models/estado-pago';
import { TipoProductoDTO } from '../../productos/models/tipo-producto';
import { TipoProductoService } from '../../productos/service/tipo-producto-service';
import { EstadoEnvio } from '../models/estado-envio';
import { EnviosService } from '../service/envios-service';
import { SedeDTO } from '../../sede/models/sede';
import { SedeService } from '../../sede/service/sede-service';

@Component({
  selector: 'app-agregar-envio',
  imports: [FormsModule, CommonModule, DecimalPipe],
  templateUrl: './agregar-envio.html',
  styleUrl: './agregar-envio.css',
})
export class AgregarEnvio {
  private enviosService       = inject(EnviosService);
  private router              = inject(Router);
  private tipoProductoService = inject(TipoProductoService);
  private route               = inject(ActivatedRoute);
  private sedeService         = inject(SedeService);

  tiposProducto = signal<TipoProductoDTO[]>([]);
  sedes         = signal<SedeDTO[]>([]);
  guardando     = signal(false);
  cargando      = signal(false);
  errorGuardar  = signal<string | null>(null);
  exitoso       = signal(false);
  modoVer       = signal(false);
  envioId       = signal<number | null>(null);
  codigoEnvio   = signal<string | null>(null);

  EstadoEnvio = EstadoEnvio;
  EstadoPago  = EstadoPago;

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
    productos: [
      { tipoProductoId: 0, descripcion: '', numeroPaquetes: 1 }
    ],
    pago: {
      monto:      0,
      metodoPago: '',
      fechaPago:  '',
      estadoPago: EstadoPago.PAGADO,
    },
    sedeOrigenId:  null as number | null,
    sedeDestinoId: null as number | null,
  };

  provincias = [
    'Cajamarca', 'Chota', 'Cutervo', 'Jaén', 'San Ignacio',
    'Celendín', 'Hualgayoc', 'Contumazá', 'San Marcos',
    'San Miguel', 'San Pablo', 'Santa Cruz'
  ];

  get totalEstimado(): number {
    return this.form.productos.reduce((acc, prod) => {
      const tipo = this.tiposProducto().find(t => t.id === prod.tipoProductoId);
      return acc + (tipo?.precioBase ?? 0) * prod.numeroPaquetes;
    }, 0);
  }

  agregarProducto(): void {
    this.form.productos.push({ tipoProductoId: 0, descripcion: '', numeroPaquetes: 1 });
  }

  eliminarProducto(index: number): void {
    if (this.form.productos.length > 1) {
      this.form.productos.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.cargarTiposProducto();
    this.cargarSedes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoVer.set(true);
      this.envioId.set(Number(id));
      this.cargarEnvio(Number(id));
    }
  }

  cargarSedes(): void {
    this.sedeService.listarActivas().subscribe({
      next:  (sedes) => this.sedes.set(sedes),
      error: () => console.error('Error al cargar sedes'),
    });
  }

  cargarTiposProducto(): void {
    this.tipoProductoService.listarPaginado(0, 50).subscribe({
      next:  (res) => this.tiposProducto.set(res.content),
      error: () => console.error('Error al cargar tipos de producto'),
    });
  }

  cargarEnvio(id: number): void {
    this.cargando.set(true);
    this.enviosService.getEnvioById(id).subscribe({
      next: (envio) => {
        this.codigoEnvio.set(envio.codigoEnvio ?? null);
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
          productos: envio.productos?.map(p => ({
            tipoProductoId: p.tipoProductoId ?? 0,
            descripcion:    p.descripcion    ?? '',
            numeroPaquetes: p.numeroPaquetes ?? 1,
          })) ?? [{ tipoProductoId: 0, descripcion: '', numeroPaquetes: 1 }],
          pago: {
            monto:      envio.pago?.monto      ?? 0,
            metodoPago: envio.pago?.metodoPago ?? '',
            fechaPago:  envio.pago?.fechaPago?.slice(0, 16) ?? '',
            estadoPago: envio.pago?.estadoPago ?? EstadoPago.PAGADO,
          },
          sedeOrigenId:  envio.sedeId        ?? null,
          sedeDestinoId: envio.sedeDestinoId ?? null,
        };
        this.cargando.set(false);
      },
      error: () => {
        this.errorGuardar.set('No se pudo cargar el envío.');
        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    if (this.modoVer()) return;

    // Validaciones
    if (!this.form.sedeOrigenId) {
      this.errorGuardar.set('Debes seleccionar la sede de origen.');
      return;
    }
    if (!this.form.sedeDestinoId) {
      this.errorGuardar.set('Debes seleccionar la sede destino.');
      return;
    }
    const productoSinTipo = this.form.productos.some(p => !p.tipoProductoId);
    if (productoSinTipo) {
      this.errorGuardar.set('Debes seleccionar el tipo de producto en todos los productos.');
      return;
    }

    this.guardando.set(true);
    this.errorGuardar.set(null);

    const dto = {
      nombreRemitente:         this.form.nombreRemitente,
      dniRemitente:            this.form.dniRemitente,
      nombreDestinatario:      this.form.nombreDestinatario,
      dniDestinatario:         this.form.dniDestinatario,
      provincia:               this.form.provincia,
      horaSalida:              this.form.horaSalida,
      horaLlegada:             this.form.horaLlegada,
      fechaEnvio:              new Date(this.form.fechaEnvio).toISOString(),
      estadoEnvio:             this.form.estadoEnvio,
      nombrePersonaAutorizada: this.form.nombrePersonaAutorizada || null,
      dniPersonaAutorizada:    this.form.dniPersonaAutorizada    || null,
      sedeId:                  this.form.sedeOrigenId,
      sedeOrigenId:            this.form.sedeOrigenId,
      sedeDestinoId:           this.form.sedeDestinoId,
      productos: this.form.productos.map(p => ({
        tipoProductoId: p.tipoProductoId,
        descripcion:    p.descripcion,
        numeroPaquetes: p.numeroPaquetes,
      })),
      pago: {
        metodoPago: this.form.pago.metodoPago,
        fechaPago:  new Date(this.form.pago.fechaPago).toISOString(),
        estadoPago: this.form.pago.estadoPago,
      },
    };

    this.enviosService.guardarEnvio(dto).subscribe({
      next: (envioGuardado) => {
        this.form.pago.monto = envioGuardado.pago?.monto ?? 0;
        this.exitoso.set(true);
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/envios']), 1500);
      },
      error: (err) => {
        this.errorGuardar.set(
          err?.error?.message ?? 'Ocurrió un error al guardar el envío. Verifica que la ruta esté habilitada.'
        );
        this.guardando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/envios']);
  }
}
