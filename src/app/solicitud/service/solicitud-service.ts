import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { CompletarSolicitudDTO, EstadoSolicitud, SolicitudDTO } from '../models/solicitud';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
   http = inject(HttpClient);
  private readonly urlSolicitudes = environment.apiUrl + '/solicitudes';

  solicitarRecojo(solicitud: SolicitudDTO): Observable<any> {
    return this.http.post<any>(`${this.urlSolicitudes}/recojo`, solicitud).pipe(
      catchError((error) => { console.error('Error al solicitar recojo:', error); throw error; })
    );
  }

  solicitarDelivery(solicitud: SolicitudDTO): Observable<any> {
    return this.http.post<any>(`${this.urlSolicitudes}/delivery`, solicitud).pipe(
      catchError((error) => { console.error('Error al solicitar delivery:', error); throw error; })
    );
  }

  listarPorSede(sedeId: number, pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(`${this.urlSolicitudes}/sede/${sedeId}`, { params }).pipe(
      catchError((error) => { console.error('Error al listar solicitudes:', error); throw error; })
    );
  }

  listarPorSedeYEstado(sedeId: number, estado: EstadoSolicitud, pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(`${this.urlSolicitudes}/sede/${sedeId}/estado/${estado}`, { params }).pipe(
      catchError((error) => { console.error('Error al listar solicitudes por estado:', error); throw error; })
    );
  }

  listarPorDni(dni: string, pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(`${this.urlSolicitudes}/cliente/${dni}`, { params }).pipe(
      catchError((error) => { console.error('Error al listar solicitudes por DNI:', error); throw error; })
    );
  }

  aceptar(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlSolicitudes}/${id}/aceptar`, {}).pipe(
      catchError((error) => { console.error('Error al aceptar solicitud:', error); throw error; })
    );
  }

  rechazar(id: number, motivo: string): Observable<any> {
    return this.http.patch<any>(`${this.urlSolicitudes}/${id}/rechazar`, motivo).pipe(
      catchError((error) => { console.error('Error al rechazar solicitud:', error); throw error; })
    );
  }

   completarRecojo(id: number, dto: CompletarSolicitudDTO): Observable<any> {
    return this.http.patch<any>(`${this.urlSolicitudes}/${id}/completar`, dto).pipe(
      catchError((e) => { console.error('Error al completar recojo:', e); throw e; })
    );
  }

  completarDelivery(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlSolicitudes}/${id}/completar`, {}).pipe(
      catchError((e) => { console.error('Error al completar delivery:', e); throw e; })
    );
  }
}
