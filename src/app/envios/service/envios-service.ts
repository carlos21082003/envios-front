import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Envios } from '../models/envios';

@Injectable({
  providedIn: 'root',
})
export class EnviosService {
  http = inject(HttpClient);

  private readonly urlEnvios = environment.apiUrl + '/envios';

  guardarEnvio(envio: Omit<Envios, 'id'>): Observable<Envios> {
    return this.http.post<Envios>(`${this.urlEnvios}/guardarEnvio`, envio).pipe(
      catchError((error) => { console.error('Error al guardar envío:', error); throw error; })
    );
  }

  listarEnvios(pagina = 0, cantidad = 15, sedeId?: number): Observable<Page<Envios>> {
    let params = new HttpParams()
      .set('pagina', pagina)
      .set('cantidad', cantidad);
    if (sedeId) params = params.set('sedeId', sedeId);
    return this.http.get<Page<Envios>>(this.urlEnvios, { params }).pipe(
      catchError((error) => { console.error('Error al listar envíos:', error); throw error; })
    );
  }

  getEnvioById(id: number): Observable<Envios> {
    return this.http.get<Envios>(`${this.urlEnvios}/${id}`).pipe(
      catchError((error) => { console.error('Error al obtener envío:', error); throw error; })
    );
  }

  rastrearEnvio(dniRemitente: string): Observable<any[]> {
    return this.http.get<any>(`${this.urlEnvios}/rastrear/${dniRemitente}`).pipe(
      map(res => Array.isArray(res) ? res : [res]),
      catchError((error) => { console.error('Error al rastrear envío:', error); throw error; })
    );
  }


  actualizarEnvio(id: number, envio: Partial<Envios>): Observable<Envios> {
    return this.http.put<Envios>(`${this.urlEnvios}/${id}`, envio).pipe(
      catchError((error) => { console.error('Error al actualizar envío:', error); throw error; })
    );
  }
}

// Interfaz auxiliar para respuestas paginadas
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}


