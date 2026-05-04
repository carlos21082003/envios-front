import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);

  private readonly urlReportes = environment.apiUrl + '/reportes';

  getReporte(): Observable<any> {
    return this.http.get<any>(this.urlReportes).pipe(
      catchError((error) => {
        console.error('Error al obtener reportes:', error);
        throw error;
      })
    );
  }
}
