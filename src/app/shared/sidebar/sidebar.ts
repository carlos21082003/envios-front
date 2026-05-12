import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/service/auth-service';
import { Roles } from '../../usuarios/models/usuarios';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);

  isMobileMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMobileMenuOpen = false;
    });
  }

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  get usuario() {
    return this.authService.usuarioActual();
  }

  get iniciales(): string {
    const nombre = this.usuario?.nombre ?? '';
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  get esSuperAdmin(): boolean {
    return this.authService.esSuperAdmin();
  }

  get esAdminOSuperAdmin(): boolean {
    return this.authService.tieneRol(Roles.SUPER_ADMIN, Roles.ADMIN);
  }

  logout(): void {
    this.authService.logout();
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.authService.getRol() ?? '');
  }
}