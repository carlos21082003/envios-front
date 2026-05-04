import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
   http = inject(HttpClient);

  private readonly urlProductos = environment.apiUrl + '/productos';

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlProductos}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener producto:', error);
        throw error;
      })
    );
  }

  // actualiza todo el producto
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.urlProductos}/${id}`, producto).pipe(
      catchError((error) => {
        console.error('Error al actualizar producto:', error);
        throw error;
      })
    );
  }
  
}
