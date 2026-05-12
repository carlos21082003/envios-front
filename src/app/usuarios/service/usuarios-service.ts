import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UsuarioDTO } from '../models/usuarios';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  http = inject(HttpClient);
  private readonly urlUsuarios = environment.apiUrl + '/usuarios';

  listar(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams().set('pagina', pagina).set('cantidad', cantidad);
    return this.http.get<any>(this.urlUsuarios, { params }).pipe(
      catchError((e) => { console.error(e); throw e; })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlUsuarios}/${id}`).pipe(
      catchError((e) => { console.error(e); throw e; })
    );
  }

  crear(usuario: UsuarioDTO): Observable<any> {
    return this.http.post<any>(this.urlUsuarios, usuario).pipe(
      catchError((e) => { console.error(e); throw e; })
    );
  }

  actualizar(id: number, usuario: UsuarioDTO): Observable<any> {
    return this.http.put<any>(`${this.urlUsuarios}/${id}`, usuario).pipe(
      catchError((e) => { console.error(e); throw e; })
    );
  }

  cambiarPassword(id: number, password: string): Observable<any> {
    return this.http.patch<any>(`${this.urlUsuarios}/${id}/password`, password).pipe(
      catchError((e) => { console.error(e); throw e; })
    );
  }
}
