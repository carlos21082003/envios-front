import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { EnviosService } from './service/envios-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-envios',
  imports: [RouterModule,CommonModule, DatePipe,RouterLink],
  templateUrl: './envios.html',
  styleUrl: './envios.css',
})
export class Envios implements OnInit {
 private enviosService = inject(EnviosService);
 private router = inject(Router);

  // Signals para el manejo de estado
  envios = signal<any[]>([]);
  paginaActual = signal<number>(0);
  totalPaginas = signal<number>(0);
  cargando = signal<boolean>(true);
  errorBusqueda = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarEnvios();
  }

  cargarEnvios(): void {
    this.cargando.set(true);
    this.errorBusqueda.set(false);
    
    this.enviosService.listarEnvios(this.paginaActual(), 15).subscribe({
      next: (response) => {
        this.envios.set(response.content);
        this.totalPaginas.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.envios.set([]);
      }
    });
  }

  buscarPorDni(dni: string): void {
    const dniLimpio = dni.trim();
    
    if (!dniLimpio) {
      this.paginaActual.set(0);
      this.cargarEnvios();
      return;
    }

    this.cargando.set(true);
    this.errorBusqueda.set(false);

    this.enviosService.rastrearEnvio(dniLimpio).subscribe({
      next: (response) => {
        this.envios.set([response]);
        this.totalPaginas.set(1);
        this.paginaActual.set(0);
        this.cargando.set(false);
      },
      error: () => {
        this.envios.set([]);
        this.errorBusqueda.set(true);
        this.cargando.set(false);
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
      this.cargarEnvios();
    }
  }

  verEnvio(id: number): void {
    this.router.navigate(['/envios/ver', id]);
  } 
}
