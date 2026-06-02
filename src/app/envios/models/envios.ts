import { PagosDTO } from "../../pagos/models/pagos";
import { ProductosDTO } from "../../productos/models/productos";
import { EstadoEnvio } from "./estado-envio";

export interface Envios {
  id?: number;
  codigoEnvio?: string;
  horaSalida: string;
  horaLlegada: string;
  fechaEnvio: string;
  nombreDestinatario: string;
  dniDestinatario: string;
  nombreRemitente: string;
  dniRemitente: string;
  estadoEnvio: EstadoEnvio;
  pago: PagosDTO;
  productos: ProductosDTO[];
  provincia: string;
  pesoTotal?: number;     
  volumenTotal?: number;
  sedeId?: number;
  sedeNombre?: string;
  nombrePersonaAutorizada?: string | null;  
  dniPersonaAutorizada?: string | null;     
  sedeOrigenId?: number | null;             
  sedeDestinoId?: number | null; 
}

