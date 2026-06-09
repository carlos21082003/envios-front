import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { EnviosService } from '../../../envios/service/envios-service';
import { EstadoEnvio } from '../../../envios/models/estado-envio';
import { Router } from '@angular/router';
import { ModalPagoLinea } from '../../../pagos/components/modal-pago-linea/modal-pago-linea';


@Component({
  selector: 'app-mis-envios',
  imports: [CommonModule, DatePipe, ModalPagoLinea],
  templateUrl: './mis-envios.html',
  styleUrl: './mis-envios.css',
})
export class MisEnvios {
  private enviosService = inject(EnviosService);
  private router        = inject(Router);

  envios   = signal<any[]>([]);
  cargando = signal(false);
  error    = signal<string | null>(null);
  filtro   = signal<string>('TODOS');

  EstadoEnvio = EstadoEnvio;

  envioSeleccionado = signal<any | null>(null);
  mostrarPago      = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.enviosService.getMisEnvios().subscribe({
      next:  (res) => { this.envios.set(res); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar tus envíos.'); this.cargando.set(false); }
    });
  }

  get enviosFiltrados(): any[] {
    if (this.filtro() === 'TODOS') return this.envios();
    return this.envios().filter(e => e.estadoEnvio === this.filtro());
  }

  setFiltro(f: string): void { this.filtro.set(f); }

  badgeClase(estado: string): string {
    const m: Record<string, string> = {
      PORSALIR:   'badge-amber',
      SALIO:      'badge-blue',
      ENTRANSITO: 'badge-purple',
      ENTREGADO:  'badge-green',
    };
    return m[estado] ?? 'badge-gray';
  }

  badgeTexto(estado: string): string {
    const m: Record<string, string> = {
      PORSALIR:   'Por salir',
      SALIO:      'Salió',
      ENTRANSITO: 'En tránsito',
      ENTREGADO:  'Entregado',
    };
    return m[estado] ?? estado;
  }

  filtros = [
  { valor: 'TODOS',     label: 'Todos' },
  { valor: 'PORSALIR',  label: 'Por salir' },
  { valor: 'SALIO',     label: 'Salió' },
  { valor: 'ENTRANSITO',label: 'En tránsito' },
  { valor: 'ENTREGADO', label: 'Entregado' },
];

  verDetalle(id: number): void {
    this.router.navigate([]);
  }

  pagarEnLinea(envio: any): void {
    this.envioSeleccionado.set(envio);
    this.mostrarPago.set(true);
  }

  volver(): void {
    this.router.navigate(['/perfil']);
  }

  onPagado(): void {
    this.cargar(); 
  }
}
