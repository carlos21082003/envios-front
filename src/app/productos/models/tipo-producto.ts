export interface TipoProductoDTO {
  id?: number;
  nombre: string;
  precioBase: number;
  descripcion: string;
  activo?: boolean;
}