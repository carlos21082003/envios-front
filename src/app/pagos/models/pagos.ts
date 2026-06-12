import { EstadoPago } from "./estado-pago";
import { MetodoPago } from "./metodo-pago";

export interface PagosDTO {
  id?: number;
  monto?: number;
  metodoPago: MetodoPago;
  fechaPago: string;
  estadoPago: EstadoPago;
}