import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnviosService } from '../service/envios-service';
import { EstadoEnvio } from '../models/estado-envio';

@Component({
  selector: 'app-buscar-envio-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-envio-cliente.html',
  styleUrl: './buscar-envio-cliente.css',
})
export class BuscarEnvioCliente {
  private enviosService = inject(EnviosService);

  dni      = '';
  envios   = signal<any[]>([]);
  envio    = signal<any | null>(null);
  cargando = signal(false);
  error    = signal<string | null>(null);

  EstadoEnvio = EstadoEnvio;

  buscar(): void {
    const dniLimpio = this.dni.trim();
    if (!dniLimpio) return;

    this.cargando.set(true);
    this.error.set(null);
    this.envio.set(null);
    this.envios.set([]);

    this.enviosService.rastrearEnvio(dniLimpio).subscribe({
      next: (res) => {
        this.envios.set(res);
        this.envio.set(res[0]);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se encontró ningún envío asociado a este DNI.');
        this.cargando.set(false);
      }
    });
  }

  seleccionar(e: any): void {
    this.envio.set(e);
  }

  limpiar(): void {
    this.dni = '';
    this.envio.set(null);
    this.envios.set([]);
    this.error.set(null);
  }

  badgeClase(estado: string): string {
    const clases: Record<string, string> = {
      [EstadoEnvio.PORSALIR]:   'bg-amber-100 text-amber-700 border border-amber-200',
      [EstadoEnvio.SALIO]:      'bg-blue-100 text-blue-700 border border-blue-200',
      [EstadoEnvio.ENTRANSITO]: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      [EstadoEnvio.ENTREGADO]:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    };
    return clases[estado] ?? 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  badgeTexto(estado: string): string {
    const textos: Record<string, string> = {
      [EstadoEnvio.PORSALIR]:   'Por salir',
      [EstadoEnvio.SALIO]:      'Salió',
      [EstadoEnvio.ENTRANSITO]: 'En tránsito',
      [EstadoEnvio.ENTREGADO]:  'Entregado',
    };
    return textos[estado] ?? estado;
  }

  pasoActivo(paso: string): boolean {
    const orden = [
      EstadoEnvio.PORSALIR,
      EstadoEnvio.SALIO,
      EstadoEnvio.ENTRANSITO,
      EstadoEnvio.ENTREGADO
    ];
    const estadoActual = this.envio()?.estadoEnvio;
    return orden.indexOf(paso as EstadoEnvio) <= orden.indexOf(estadoActual);
  }
}