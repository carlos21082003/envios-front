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
  codigoEnvio?: string;
  nombrePersonaRecibe?: string;
  dniPersonaRecibe?: string;
  sedeDestinoId?: number;
  sedeDestinoNombre?: string;
  nombreDestinatario?: string;
  dniDestinatario?: string;
  provinciaDestino?: string;
}

export interface CompletarSolicitudDTO {
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