import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from './service/usuarios-service';
import { SedeDTO } from '../sede/models/sede';
import { Roles, UsuarioDTO } from './models/usuarios';
import { SedeService } from '../sede/service/sede-service';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  private sedeService     = inject(SedeService);

  usuarios       = signal<UsuarioDTO[]>([]);
  sedes          = signal<SedeDTO[]>([]);
  cargando       = signal(false);
  guardando      = signal(false);
  errorMsg       = signal<string | null>(null);
  exitoso        = signal<string | null>(null);
  mostrarModal   = signal(false);
  modoEditar     = signal(false);
  mostrarModalPassword = signal(false);

  paginaActual   = signal(0);
  totalPaginas   = signal(0);
  totalElementos = signal(0);
  readonly cantidad = 15;

  Roles = Roles;

  usuarioSeleccionado = signal<UsuarioDTO | null>(null);
  nuevaPassword       = signal('');

  form: UsuarioDTO = {
    nombre:   '',
    dni:      '',
    password: '',
    rol:      Roles.EMPLEADO,
    sedeId:   undefined,
    activo:   true,
  };

  ngOnInit(): void {
    this.cargar();
    this.cargarSedes();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuariosService.listar(this.paginaActual(), this.cantidad).subscribe({
      next: (res) => {
        this.usuarios.set(res.content);
        this.totalPaginas.set(res.totalPages);
        this.totalElementos.set(res.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar usuarios.');
        this.cargando.set(false);
      }
    });
  }

  cargarSedes(): void {
    this.sedeService.listarActivas().subscribe({
      next: (sedes) => this.sedes.set(sedes),
      error: () => console.error('Error al cargar sedes')
    });
  }

  abrirModalNuevo(): void {
    this.form = { nombre: '', dni: '', password: '', rol: Roles.EMPLEADO, sedeId: undefined, activo: true };
    this.modoEditar.set(false);
    this.errorMsg.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(usuario: UsuarioDTO): void {
    this.form = { ...usuario, password: '' };
    this.usuarioSeleccionado.set(usuario);
    this.modoEditar.set(true);
    this.errorMsg.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalPassword(usuario: UsuarioDTO): void {
    this.usuarioSeleccionado.set(usuario);
    this.nuevaPassword.set('');
    this.errorMsg.set(null);
    this.mostrarModalPassword.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.mostrarModalPassword.set(false);
    this.errorMsg.set(null);
  }

  guardar(): void {
    this.guardando.set(true);
    this.errorMsg.set(null);

    const accion = this.modoEditar()
      ? this.usuariosService.actualizar(this.usuarioSeleccionado()!.id!, this.form)
      : this.usuariosService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.mostrarExitoso(this.modoEditar() ? 'Usuario actualizado.' : 'Usuario creado.');
        this.cargar();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Error al guardar el usuario.');
        this.guardando.set(false);
      }
    });
  }

  cambiarPassword(): void {
    if (!this.nuevaPassword()) {
      this.errorMsg.set('Ingresa la nueva contraseña.');
      return;
    }
    this.guardando.set(true);
    this.usuariosService.cambiarPassword(this.usuarioSeleccionado()!.id!, this.nuevaPassword()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.mostrarExitoso('Contraseña actualizada.');
      },
      error: () => {
        this.errorMsg.set('Error al cambiar la contraseña.');
        this.guardando.set(false);
      }
    });
  }

  mostrarExitoso(msg: string): void {
    this.exitoso.set(msg);
    setTimeout(() => this.exitoso.set(null), 3000);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  rolLabel(rol: Roles): string {
    const labels: Record<string, string> = {
      [Roles.SUPER_ADMIN]: 'Super Admin',
      [Roles.ADMIN]:       'Admin',
      [Roles.EMPLEADO]:    'Empleado',
      [Roles.CLIENTE]:     'Cliente',
    };
    return labels[rol] ?? rol;
  }

  rolClase(rol: Roles): string {
    const clases: Record<string, string> = {
      [Roles.SUPER_ADMIN]: 'bg-purple-100 text-purple-700',
      [Roles.ADMIN]:       'bg-blue-100 text-blue-700',
      [Roles.EMPLEADO]:    'bg-slate-100 text-slate-600',
      [Roles.CLIENTE]:     'bg-green-100 text-green-700',
    };
    return clases[rol] ?? 'bg-slate-100 text-slate-600';
  }

  necesitaSede(): boolean {
    return this.form.rol === Roles.ADMIN || this.form.rol === Roles.EMPLEADO;
  }
}
