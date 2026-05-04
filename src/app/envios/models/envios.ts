import { PagosDTO } from "../../pagos/models/pagos";
import { ProductosDTO } from "../../productos/models/productos";
import { EstadoEnvio } from "./estado-envio";

export interface Envios {
     id?: number;
  horaSalida: string;
  horaLlegada: string;
  fechaEnvio: string;
  nombreDestinatario: string;
  dniDestinatario: string;
  nombreRemitente: string;
  dniRemitente: string;
  estadoEnvio: EstadoEnvio;
  pago: PagosDTO;
  producto: ProductosDTO;
  provincia: string;
}

