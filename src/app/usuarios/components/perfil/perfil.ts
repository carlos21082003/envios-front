import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/service/auth-service';
import { EnviosService } from '../../../envios/service/envios-service';
import { UsuariosService } from '../../service/usuarios-service';
import { Router } from '@angular/router';
import { UsuarioDTO } from '../../models/usuarios';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private authService    = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private router         = inject(Router);

  usuario  = signal<UsuarioDTO | null>(null);
  cargando = signal(false);
  error    = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando.set(true);
    this.usuariosService.getMe().subscribe({
      next:  (u) => { this.usuario.set(u); this.cargando.set(false); },
      error: () => { this.error.set('No se pudo cargar el perfil.'); this.cargando.set(false); }
    });
  }

  get iniciales(): string {
    const nombre = this.usuario()?.nombre ?? '';
    return nombre.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
  }

  get esCliente(): boolean {
    return this.authService.getRol() === 'CLIENTE';
  }

  irAMisEnvios(): void {
    this.router.navigate(['/mis-envios']);
  }

  
  hasRole(...roles: string[]): boolean {
    return roles.includes(this.authService.getRol() ?? '');
  }
}
