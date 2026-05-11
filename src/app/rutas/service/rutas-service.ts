import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RutaSedeDTO } from '../models/rutas';

@Injectable({
  providedIn: 'root',
})
export class RutasService {
   http = inject(HttpClient);
  private readonly urlRutas = environment.apiUrl + '/rutas-sedes';

  listar(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(this.urlRutas, { params }).pipe(
      catchError((error) => { console.error('Error al listar rutas:', error); throw error; })
    );
  }

  listarPorOrigen(sedeOrigenId: number): Observable<any> {
    return this.http.get<any>(`${this.urlRutas}/origen/${sedeOrigenId}`).pipe(
      catchError((error) => { console.error('Error al listar rutas por origen:', error); throw error; })
    );
  }

  crear(ruta: RutaSedeDTO): Observable<any> {
    return this.http.post<any>(this.urlRutas, ruta).pipe(
      catchError((error) => { console.error('Error al crear ruta:', error); throw error; })
    );
  }

  cambiarEstado(id: number, activo: boolean): Observable<any> {
    const params = new HttpParams().set('activo', activo);
    return this.http.patch<any>(`${this.urlRutas}/${id}/estado`, {}, { params }).pipe(
      catchError((error) => { console.error('Error al cambiar estado de ruta:', error); throw error; })
    );
  }
}
