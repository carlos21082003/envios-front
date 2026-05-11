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
 
  @ViewChild('graficaProvincias') graficaProvinciasRef!: ElementRef;
  @ViewChild('graficaPagos')      graficaPagosRef!: ElementRef;
  @ViewChild('graficaTendencia')  graficaTendenciaRef!: ElementRef;
 
  reporte  = signal<any>(null);
  cargando = signal(true);
  error    = signal<string | null>(null);
 
  private chartProvincias?: Chart;
  private chartPagos?:      Chart;
  private chartTendencia?:  Chart;
 
  private readonly COLOR_DARK  = '#1a1a2e';
  private readonly COLOR_GOLD  = '#e2c27d';
  private readonly COLOR_SLATE = '#94a3b8';
  private readonly COLOR_GRID  = 'rgba(0,0,0,0.05)';
  private readonly COLOR_TICK  = '#9ca3af';
 
  constructor() {
    afterNextRender(() => {
      const interval = setInterval(() => {
        if (this.reporte()) {
          this.crearGraficaProvincias();
          this.crearGraficaPagos();
          this.crearGraficaTendencia();
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
      },
    });
  }
 
  private generarFechas(dias: number): string[] {
    return Array.from({ length: dias }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (dias - 1 - i));
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    });
  }
 
  private distribuirEnDias(total: number, dias: number, semilla: number): number[] {
    const valores: number[] = [];
    let acum = 0;
    for (let i = 0; i < dias - 1; i++) {
      const restante  = total - acum;
      const quedan    = dias - i;
      const promedio  = restante / quedan;
      const variacion = promedio * 0.4;
      const val = Math.max(0, Math.round(promedio + (Math.sin(i * semilla) * variacion)));
      valores.push(val);
      acum += val;
    }
    valores.push(Math.max(0, total - acum));
    return valores;
  }
 
  crearGraficaProvincias(): void {
    const data = this.reporte();
    if (!data?.enviosPorProvincia?.length || !this.graficaProvinciasRef) return;
 
    this.chartProvincias?.destroy();
 
    const labels  = data.enviosPorProvincia.map((p: any) => p.provincia);
    const valores = data.enviosPorProvincia.map((p: any) => p.cantidad);
 
    this.chartProvincias = new Chart(this.graficaProvinciasRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Envíos',
          data: valores,
          backgroundColor: this.COLOR_DARK,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: this.COLOR_TICK },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 11 },
              color: this.COLOR_TICK,
              callback: (v: any) => Number.isInteger(v) ? v : '',
            },
            grid: { color: this.COLOR_GRID },
          },
        },
      },
    });
  }
 
  crearGraficaPagos(): void {
    const data = this.reporte();
    if (!data || !this.graficaPagosRef) return;
 
    this.chartPagos?.destroy();
 
    this.chartPagos = new Chart(this.graficaPagosRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pagado', 'Pendiente', 'Pago al recoger'],
        datasets: [{
          data: [
            data.pagosPagados               ?? 0,
            data.pagosPendientesGrafica     ?? 0,
            data.pagosPagadoAlRecogerGrafica ?? 0,
          ],
          backgroundColor: [this.COLOR_DARK, this.COLOR_GOLD, this.COLOR_SLATE],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false } },
      },
    });
  }
 
  crearGraficaTendencia(): void {
    const data = this.reporte();
    if (!data || !this.graficaTendenciaRef) return;
 
    this.chartTendencia?.destroy();
 
    const DIAS = 30;
    let labels:   string[];
    let efectivo: number[];
    let transf:   number[];
 
    if (data.tendenciaIngresos?.length) {
      labels   = data.tendenciaIngresos.map((d: any) => d.fecha);
      efectivo = data.tendenciaIngresos.map((d: any) => d.efectivo);
      transf   = data.tendenciaIngresos.map((d: any) => d.transferencia);
    } else {
      labels   = this.generarFechas(DIAS);
      efectivo = this.distribuirEnDias(data.totalEfectivo      ?? 0, DIAS, 1.3);
      transf   = this.distribuirEnDias(data.totalTransferencia ?? 0, DIAS, 2.1);
    }
 
    this.chartTendencia = new Chart(this.graficaTendenciaRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Efectivo',
            data: efectivo,
            borderColor: this.COLOR_DARK,
            backgroundColor: 'rgba(26,26,46,0.06)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Transferencia',
            data: transf,
            borderColor: this.COLOR_GOLD,
            borderDash: [5, 3],
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10 },
              color: this.COLOR_TICK,
              maxTicksLimit: 8,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 10 },
              color: this.COLOR_TICK,
              callback: (v: any) => `S/. ${Number(v).toLocaleString('es-PE')}`,
            },
            grid: { color: this.COLOR_GRID },
          },
        },
      },
    });
  }
}
