import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from '../../usuarios/service/usuarios-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Roles } from '../../usuarios/models/usuarios';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private usuariosService = inject(UsuariosService);
  private router          = inject(Router);

  paso        = signal<'form' | 'exito'>('form');
  cargando    = signal(false);
  errorMsg    = signal<string | null>(null);
  mostrarPass = signal(false);

  form = {
    nombre:    '',
    dni:       '',
    password:  '',
    telefono:  '',
    direccion: '',
    rol:       Roles.CLIENTE,
  };

  confirmarPassword = '';

  registrar(): void {
    if (!this.form.nombre || !this.form.dni || !this.form.password) {
      this.errorMsg.set('Nombre, DNI y contraseña son obligatorios.');
      return;
    }
    if (this.form.dni.length !== 8) {
      this.errorMsg.set('El DNI debe tener 8 dígitos.');
      return;
    }
    if (this.form.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.form.password !== this.confirmarPassword) {
      this.errorMsg.set('Las contraseñas no coinciden.');
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set(null);

    this.usuariosService.crear(this.form as any).subscribe({
      next: () => {
        this.cargando.set(false);
        this.paso.set('exito');
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Error al crear la cuenta.');
        this.cargando.set(false);
      }
    });
  }
}
