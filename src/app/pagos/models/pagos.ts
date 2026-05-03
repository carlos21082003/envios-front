import { EstadoPago } from "./estado-pago";

export interface PagosDTO {
  id?: number;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  estadoPago: EstadoPago;
}