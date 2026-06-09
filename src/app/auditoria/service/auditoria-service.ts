import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuditoriaModel, PageResponse } from '../models/auditoria-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
 http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/auditoria';

  listar(pagina = 0, cantidad = 20): Observable<PageResponse<AuditoriaModel>> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<PageResponse<AuditoriaModel>>(this.url, { params });
  }

  listarErrores(pagina = 0, cantidad = 20): Observable<PageResponse<AuditoriaModel>> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<PageResponse<AuditoriaModel>>(`${this.url}/errores`, { params });
  }

  listarPorUsuario(dni: string, pagina = 0, cantidad = 20): Observable<PageResponse<AuditoriaModel>> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<PageResponse<AuditoriaModel>>(`${this.url}/usuario/${dni}`, { params });
  }

  listarPorEndpoint(endpoint: string, pagina = 0, cantidad = 20): Observable<PageResponse<AuditoriaModel>> {
    const params = new HttpParams().set('endpoint', endpoint).set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<PageResponse<AuditoriaModel>>(`${this.url}/endpoint`, { params });
  }
}
