export interface RutaSedeDTO {
  id?: number;
  sedeOrigenId: number;
  sedeOrigenNombre?: string;
  sedeDestinoId: number;
  sedeDestinoNombre?: string;
  activo?: boolean;
}