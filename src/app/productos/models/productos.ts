export interface ProductosDTO {
  id?: number;
  tipoProductoId: number;
  tipoProductoNombre?: string;
  descripcion: string;
  numeroPaquetes: number;  
  peso?: number;
  volumen?: number;
  precioPorProducto?: number;
}