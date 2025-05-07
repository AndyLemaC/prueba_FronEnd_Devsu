import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product, ApiResponse } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/bp/products`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos financieros
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(
        map(response => response.data),
        tap(products => this.productsSubject.next(products)),
        catchError(error => {console.error('Error al obtener productos:', error); return throwError(() => error);})
      );
  }

  /**
   * Verifica si un ID ya existe
   * @param id ID a verificar
   */
  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo producto financiero
   * @param product Datos del producto a crear
   */
  createProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(
        tap(() => this.refreshProducts()),
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un producto financiero existente
   * @param product Datos del producto a actualizar
   */
  updateProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${product.id}`, product)
      .pipe(
        tap(() => this.refreshProducts()),
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un producto financiero
   * @param id ID del producto a eliminar
   */
  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.refreshProducts()),
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza la lista de productos después de una operación
   */
  private refreshProducts(): void {
    this.getProducts().subscribe();
  }

  /**
   * Maneja los errores de las peticiones HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error?.message || error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}