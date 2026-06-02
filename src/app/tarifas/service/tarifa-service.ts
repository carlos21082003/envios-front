import { inject, Injectable } from '@angular/core';
import { TarifaAdicional } from '../models/tarifa';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
   http = inject(HttpClient);

  private readonly urlTarifas = environment.apiUrl + '/tarifas';

  getTarifaVigente(): Observable<TarifaAdicional> {
    return this.http.get<TarifaAdicional>(`${this.urlTarifas}/vigente`).pipe(
      catchError((error) => {
        console.error('Error al obtener tarifa vigente:', error);
        throw error;
      })
    );
  }
}
