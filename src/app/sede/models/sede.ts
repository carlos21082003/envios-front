export interface SedeDTO {
  id?: number;
  nombre: string;
  provincia: string;
  direccion: string;
  telefono: string;
  esPrincipal?: boolean;
  tieneRecojo?: boolean;
  tieneDelivery?: boolean;
  activo?: boolean;
}