export interface ProductosDTO {
  id?: number;
  tipoProductoId: number;       // antes era tipoProducto: string
  tipoProductoNombre?: string;  // solo viene en responses
  descripcion: string;
  numeroPaquetes: number;
  precioPorProducto?: number;
}