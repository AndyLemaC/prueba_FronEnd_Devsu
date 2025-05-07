import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorNotification {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorsSubject = new BehaviorSubject<ErrorNotification | null>(null);
  public errors$ = this.errorsSubject.asObservable();

  constructor() { }

  /**
   * Muestra un mensaje de error en la interfaz
   * @param message Mensaje de error
   */
  showError(message: string): void {
    this.errorsSubject.next({
      message,
      type: 'error',
      timestamp: Date.now()
    });
  }

  /**
   * Muestra un mensaje de éxito en la interfaz
   * @param message Mensaje de éxito
   */
  showSuccess(message: string): void {
    this.errorsSubject.next({
      message,
      type: 'success',
      timestamp: Date.now()
    });
  }

  /**
   * Muestra un mensaje informativo en la interfaz
   * @param message Mensaje informativo
   */
  showInfo(message: string): void {
    this.errorsSubject.next({
      message,
      type: 'info',
      timestamp: Date.now()
    });
  }

  /**
   * Muestra un mensaje de advertencia en la interfaz
   * @param message Mensaje de advertencia
   */
  showWarning(message: string): void {
    this.errorsSubject.next({
      message,
      type: 'warning',
      timestamp: Date.now()
    });
  }

  /**
   * Limpia los mensajes de error
   */
  clearErrors(): void {
    this.errorsSubject.next(null);
  }
}