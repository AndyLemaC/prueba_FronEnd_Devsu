import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class IdValidatorService {

  constructor(private productService: ProductService) { }

  /**
   * Validador asincrono para verificar si un ID de producto ya existe
   * @param idToExclude ID a excluir de la validación (para edición)
   * @returns AsyncValidatorFn - Función validadora asíncrona
   */
  validateUniqueId(idToExclude?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Si no hay valor o es el mismo que se está editando, no validar
      if (!control.value || control.value === idToExclude) {
        return of(null);
      }

      // Debounce para evitar demasiadas peticiones mientras el usuario escribe
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(id => 
          this.productService.verifyProductId(id).pipe(
            map(exists => (exists ? { idExists: true } : null)),
            catchError(() => of(null)),
            first() // Completar el observable después del primer valor
          )
        )
      );
    };
  }
}