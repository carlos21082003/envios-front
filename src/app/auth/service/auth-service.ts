import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { LoginDTO, Roles, TokenDTO } from '../../usuarios/models/usuarios';
import { catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http       = inject(HttpClient);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly url = environment.apiUrl + '/usuarios/login';

  usuarioActual = signal<TokenDTO | null>(null);

  constructor() {
    this.cargarSesion();
  }

  private esBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(dto: LoginDTO): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(this.url, dto).pipe(
      tap((res) => {
        if (this.esBrowser()) {
          localStorage.setItem('token',   res.token);
          localStorage.setItem('usuario', JSON.stringify(res));
        }
        this.usuarioActual.set(res);
      }),
      catchError((e) => { console.error('Error login:', e); throw e; })
    );
  }

  logout(): void {
    if (this.esBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.esBrowser()) return null;
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return !!this.getToken();
  }

  getRol(): string | null {
    return this.usuarioActual()?.rol ?? null;
  }

  getSedeId(): number | null {
    return this.usuarioActual()?.sedeId ?? null;
  }

  esSuperAdmin(): boolean {
    return this.getRol() === Roles.SUPER_ADMIN;
  }

  esAdmin(): boolean {
    return this.getRol() === Roles.ADMIN;
  }

  esEmpleado(): boolean {
    return this.getRol() === Roles.EMPLEADO;
  }

  tieneRol(...roles: Roles[]): boolean {
    return roles.some(r => r === this.getRol());
  }

  private cargarSesion(): void {
    if (!this.esBrowser()) return;
    const raw = localStorage.getItem('usuario');
    if (raw) {
      try {
        this.usuarioActual.set(JSON.parse(raw));
      } catch {
        this.logout();
      }
    }
  }
}
