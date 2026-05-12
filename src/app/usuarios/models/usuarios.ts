export interface UsuarioDTO {
  id?: number;
  nombre: string;
  dni: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  rol: Roles;
  sedeId?: number;
  sedeNombre?: string;
  activo?: boolean;
}

export interface LoginDTO {
  dni: string;
  password: string;
}

export interface TokenDTO {
  token: string;
  dni: string;
  rol: string;
  nombre: string;
  sedeId?: number;
  sedeNombre?: string;
}

export enum Roles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN       = 'ADMIN',
  EMPLEADO    = 'EMPLEADO',
  CLIENTE     = 'CLIENTE'
}