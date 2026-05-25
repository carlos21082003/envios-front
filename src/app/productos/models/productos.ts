export interface ProductosDTO {
  id?: number;
  tipoProductoId: number;      
  tipoProductoNombre?: string;  
  descripcion: string;
  numeroPaquetes: number;
  precioPorProducto?: number;
}