import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router      = inject(Router);

  cargando    = signal(false);
  errorMsg    = signal<string | null>(null);
  mostrarPass = signal(false);

  form = { dni: '', password: '' };

  ngOnInit(): void {
    if (this.authService.estaLogueado()) {
      this.redirigirSegunRol();
    }
  }
  
  private redirigirSegunRol(): void {
    if (this.authService.esSuperAdmin() || this.authService.esAdmin()) {
      this.router.navigate(['/dashboard']);
    } else if (this.authService.esEmpleado()) {
      this.router.navigate(['/envios']);
    } else {
      this.router.navigate(['/rastreo']);
    }
  }

  login(): void {
  if (!this.form.dni || !this.form.password) {
    this.errorMsg.set('Ingresa tu DNI y contraseña.');
    return;
  }
  
  this.cargando.set(true);
  this.errorMsg.set(null);

  this.authService.login(this.form).subscribe({
    next: () => {
      this.cargando.set(false);
      
      // REDIRECCIÓN DINÁMICA
      if (this.authService.esSuperAdmin() || this.authService.esAdmin()) {
        this.router.navigate(['/dashboard']);
      } else if (this.authService.esEmpleado()) {
        this.router.navigate(['/envios']);
      } else {
        this.router.navigate(['/rastreo']);
      }
    },
    error: (err) => {
      this.errorMsg.set(err?.error?.message ?? 'Credenciales incorrectas.');
      this.cargando.set(false);
    }
  });
}
}
