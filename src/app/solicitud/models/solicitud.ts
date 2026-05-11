export interface SolicitudDTO {
  id?: number;
  tipo: TipoSolicitud;
  nombreSolicitante: string;
  dniSolicitante: string;
  telefono: string;
  direccion: string;
  referencia?: string;
  descripcionProducto?: string;
  fechaSolicitada?: string;
  fechaAtencion?: string;
  estado?: EstadoSolicitud;
  motivoRechazo?: string;
  sedeId: number;
  sedeNombre?: string;
  envioId?: number;
  nombrePersonaRecibe?: string;
  dniPersonaRecibe?: string;
  sedeDestinoId?: number;
  sedeDestinoNombre?: string;
}

export interface CompletarSolicitudDTO {
  nombreDestinatario: string;
  dniDestinatario: string;
  provincia: string;
  horaSalida: string;
  horaLlegada: string;
  tipoProductoId: number;
  numeroPaquetes: number;
  metodoPago: string;
  estadoPago: string;
}

export enum TipoSolicitud {
  RECOJO    = 'RECOJO',
  DELIVERY  = 'DELIVERY'
}

export enum EstadoSolicitud {
  PENDIENTE  = 'PENDIENTE',
  ACEPTADA   = 'ACEPTADA',
  RECHAZADA  = 'RECHAZADA',
  COMPLETADA = 'COMPLETADA'
}