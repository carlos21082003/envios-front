import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuditoriaModel, PageResponse } from './models/auditoria-model';
import { AuditoriaService } from './service/auditoria-service';

@Component({
  selector: 'app-auditoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
  
export class Auditoria implements OnInit {
 private svc = inject(AuditoriaService);

  tab = signal<'todos' | 'errores' | 'usuario' | 'endpoint'>('todos');
  registros = signal<AuditoriaModel[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  pagina = signal(0);
  readonly cantidad = 15;
  cargando = signal(true);
  expandedId = signal<number | null>(null);

  dniFiltro = signal('');
  endpointFiltro = signal('');
  private filtroChange$ = new Subject<string>();

  duracionProm = computed(() => {
    const lista = this.registros();
    if (!lista.length) return 0;
    return Math.round(lista.reduce((a, r) => a + (r.duracionMs ?? 0), 0) / lista.length);
  });

  cantidadErrores = computed(() =>
    this.registros().filter(r => r.statusCode >= 400).length
  );

  ngOnInit() {
    this.filtroChange$.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.pagina.set(0); this.cargar(); });
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.expandedId.set(null);

    const obs$ = this.tab() === 'errores'
      ? this.svc.listarErrores(this.pagina(), this.cantidad)
      : this.tab() === 'usuario' && this.dniFiltro().trim()
      ? this.svc.listarPorUsuario(this.dniFiltro().trim(), this.pagina(), this.cantidad)
      : this.tab() === 'endpoint' && this.endpointFiltro().trim()
      ? this.svc.listarPorEndpoint(this.endpointFiltro().trim(), this.pagina(), this.cantidad)
      : this.svc.listar(this.pagina(), this.cantidad);

    obs$.subscribe({
      next: (page) => {
        this.registros.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando.set(false);
      }
    });
  }

  cambiarTab(tab: 'todos' | 'errores' | 'usuario' | 'endpoint') {
    this.tab.set(tab); this.pagina.set(0); this.cargar();
  }

  onFiltroInput() {
    this.filtroChange$.next(this.dniFiltro() + this.endpointFiltro());
  }

  toggleDetalle(id: number) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  paginaAnterior() { this.pagina.update(p => p - 1); this.cargar(); }
  paginaSiguiente() { this.pagina.update(p => p + 1); this.cargar(); }

  badgeMetodo(m: string) {
    const map: Record<string, string> = {
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-amber-100 text-amber-800',
      PATCH: 'bg-amber-100 text-amber-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return map[m] ?? 'bg-gray-100 text-gray-700';
  }

  badgeStatus(s: number) {
    return s >= 500 ? 'bg-red-100 text-red-800'
         : s >= 400 ? 'bg-amber-100 text-amber-800'
         : 'bg-green-100 text-green-800';
  }
}
