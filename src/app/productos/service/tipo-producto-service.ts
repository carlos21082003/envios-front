import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { catchError, Observable } from 'rxjs';
import { TipoProductoDTO } from '../models/tipo-producto';

@Injectable({
  providedIn: 'root',
})
export class TipoProductoService {
     http = inject(HttpClient);

  private readonly urlTipoProductos = environment.apiUrl + '/tipo-productos';

  listarTipoProductos(pagina: number = 0, cantidad: number = 15): Observable<any> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('cantidad', cantidad);
    return this.http.get<any>(this.urlTipoProductos, { params }).pipe(
      catchError((error) => {
        console.error('Error al listar tipos de producto:', error);
        throw error;
      })
    );
  }

  getTipoProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlTipoProductos}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener tipo de producto:', error);
        throw error;
      })
    );
  }

  guardarTipoProducto(tipoProducto: TipoProductoDTO): Observable<any> {
    return this.http.post<any>(this.urlTipoProductos, tipoProducto).pipe(
      catchError((error) => {
        console.error('Error al guardar tipo de producto:', error);
        throw error;
      })
    );
  }

  actualizarTipoProducto(id: number, tipoProducto: TipoProductoDTO): Observable<any> {
    return this.http.put<any>(`${this.urlTipoProductos}/${id}`, tipoProducto).pipe(
      catchError((error) => {
        console.error('Error al actualizar tipo de producto:', error);
        throw error;
      })
    );
  }

  eliminarTipoProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlTipoProductos}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar tipo de producto:', error);
        throw error;
      })
    );
  }

}
