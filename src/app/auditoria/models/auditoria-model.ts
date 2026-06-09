export interface AuditoriaModel {
  id: number;
  metodo: string;
  endpoint: string;
  statusCode: number;
  dniUsuario: string | null;
  rolUsuario: string | null;
  ipOrigen: string;
  mensajeError: string | null;
  requestBody: string | null;
  duracionMs: number;
  fecha: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}