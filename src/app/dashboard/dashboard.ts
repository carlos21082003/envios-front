import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterNextRender, AfterViewInit, Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { DashboardService} from './service/dashboard-service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private reportesService = inject(DashboardService);
  private platformId      = inject(PLATFORM_ID);

  @ViewChild('graficaProvincias') graficaProvinciasRef!: ElementRef;
  @ViewChild('graficaPagos')      graficaPagosRef!: ElementRef;

  reporte  = signal<any>(null);
  cargando = signal(true);
  error    = signal<string | null>(null);

  private chartProvincias?: Chart;
  private chartPagos?: Chart;

  constructor() {
    // afterNextRender garantiza que el DOM ya existe
    afterNextRender(() => {
      const interval = setInterval(() => {
        if (this.reporte() && isPlatformBrowser(this.platformId)) {
          this.crearGraficaProvincias();
          this.crearGraficaPagos();
          clearInterval(interval);
        }
      }, 100);
    });
  }

  ngOnInit(): void {
    this.reportesService.getReporte().subscribe({
      next: (data) => {
        this.reporte.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el reporte.');
        this.cargando.set(false);
      }
    });
  }

  crearGraficaProvincias(): void {
    const data = this.reporte();
    if (!data?.enviosPorProvincia || !this.graficaProvinciasRef) return;

    // destruye si ya existe
    if (this.chartProvincias) {
      this.chartProvincias.destroy();
    }

    const labels  = data.enviosPorProvincia.map((p: any) => p.provincia);
    const valores = data.enviosPorProvincia.map((p: any) => p.cantidad);

    this.chartProvincias = new Chart(this.graficaProvinciasRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Envíos',
          data: valores,
          backgroundColor: '#1a1a2e',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#6b6b7b' }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 }, color: '#6b6b7b' },
            grid: { color: '#f1f1f1' }
          }
        }
      }
    });
  }

  crearGraficaPagos(): void {
    const data = this.reporte();
    if (!data || !this.graficaPagosRef) return;

    if (this.chartPagos) {
      this.chartPagos.destroy();
    }

    this.chartPagos = new Chart(this.graficaPagosRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pagado', 'Pendiente', 'Pago al recoger'],
        datasets: [{
          data: [
            data.pagosPagados,
            data.pagosPendientesGrafica,
            data.pagosPagadoAlRecogerGrafica
          ],
          backgroundColor: ['#1a1a2e', '#e2c27d', '#94a3b8'],
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 11 },
              color: '#6b6b7b',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8,
            }
          }
        }
      }
    });
  }
}
