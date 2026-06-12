import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
   http = inject(HttpClient);

  private readonly urlPagos = environment.apiUrl + '/pagos';

  listarPagos(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('cantidad', cantidad);

    return this.http.get<any>(this.urlPagos, { params }).pipe(
      catchError((error) => {
        console.error('Error al listar pagos:', error);
        throw error;
      })
    );
  }

  getPagoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlPagos}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener pago:', error);
        throw error;
      })
    );
  }

  // actualiza todo el pago
  actualizarPago(id: number, pago: any): Observable<any> {
    return this.http.put<any>(`${this.urlPagos}/${id}`, pago).pipe(
      catchError((error) => {
        console.error('Error al actualizar pago:', error);
        throw error;
      })
    );
  }  

  pagarEnLinea(envioId: number): Observable<any> {
    return this.http.post<any>(`${this.urlPagos}/envio/${envioId}/pagar-en-linea`, null).pipe(
      catchError((error) => {
        console.error('Error al procesar pago:', error);
        throw error;
      })
    );
  }

}
