import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { catchError, Observable } from 'rxjs';
import { SedeDTO } from '../models/sede';

@Injectable({
  providedIn: 'root',
})
export class SedeService {
  http = inject(HttpClient);
  private readonly urlSedes = environment.apiUrl + '/sedes';

  listar(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(this.urlSedes, { params }).pipe(
      catchError((error) => { console.error('Error al listar sedes:', error); throw error; })
    );
  }

  listarTodas(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(`${this.urlSedes}/todas`, { params }).pipe(
      catchError((error) => { console.error('Error al listar todas las sedes:', error); throw error; })
    );
  }

  listarActivas(): Observable<any> {
    return this.http.get<any>(`${this.urlSedes}/activas`).pipe(
      catchError((error) => { console.error('Error al listar sedes activas:', error); throw error; })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlSedes}/${id}`).pipe(
      catchError((error) => { console.error('Error al obtener sede:', error); throw error; })
    );
  }

  guardar(sede: SedeDTO): Observable<any> {
    return this.http.post<any>(this.urlSedes, sede).pipe(
      catchError((error) => { console.error('Error al guardar sede:', error); throw error; })
    );
  }

  actualizar(id: number, sede: SedeDTO): Observable<any> {
    return this.http.put<any>(`${this.urlSedes}/${id}`, sede).pipe(
      catchError((error) => { console.error('Error al actualizar sede:', error); throw error; })
    );
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlSedes}/${id}`).pipe(
      catchError((error) => { console.error('Error al desactivar sede:', error); throw error; })
    );
  }

  activar(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlSedes}/${id}/activar`, {}).pipe(
      catchError((error) => { console.error('Error al activar sede:', error); throw error; })
    );
  }
}
