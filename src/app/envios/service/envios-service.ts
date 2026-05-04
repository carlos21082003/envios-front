import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Envios } from '../models/envios';
import { EstadoEnvio } from '../models/estado-envio';

@Injectable({
  providedIn: 'root',
})
export class EnviosService {
  http = inject(HttpClient);

  private readonly urlEnvios = environment.apiUrl + '/envios';

  guardarEnvio(envio: Envios): Observable<any> {
    return this.http.post<any>(`${this.urlEnvios}/guardarEnvio`, envio).pipe(
      catchError((error) => {
        console.error('Error al guardar envío:', error);
        throw error;
      })
    );
  }

  // Obtener lista paginada de envíos
  listarEnvios(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('cantidad', cantidad);

    return this.http.get<any>(this.urlEnvios, { params }).pipe(
      catchError((error) => {
        console.error('Error al listar envíos:', error);
        throw error;
      })
    );
  }

  //listar por id
  getEnvioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEnvios}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener envío:', error);
        throw error;
      })
    );
  }

  // Rastrear envío por DNI del remitente
  rastrearEnvio(dniRemitente: string): Observable<any> {
    return this.http.get<any>(`${this.urlEnvios}/rastrear/${dniRemitente}`).pipe(
      catchError((error) => {
        console.error('Error al rastrear envío:', error);
        throw error;
      })
    );
  }

  actualizarEnvio(id: number, envio: any): Observable<any> {
    return this.http.put<any>(`${this.urlEnvios}/${id}`, envio).pipe(
      catchError((error) => {
        console.error('Error al actualizar envío:', error);
        throw error;
      })
    );
  }

}
