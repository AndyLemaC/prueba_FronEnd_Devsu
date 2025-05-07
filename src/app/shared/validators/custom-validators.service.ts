
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formatDate } from '@angular/common';

export class CustomValidators {
  /**
   * Valida que la fecha sea igual o posterior a la fecha actual
   */
  static futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      
      // Normalizar las fechas eliminando la parte horaria
      const normalizedInputDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      return normalizedInputDate >= normalizedToday ? null : { pastDate: true };
    };
  }

  /**
   * Valida que la fecha de revisión sea exactamente un año después de la fecha de liberación
   * @param releaseDateControlName Nombre del control de la fecha de liberación
   */
  static revisionDateValidator(releaseDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const releaseDate = control.parent?.get(releaseDateControlName)?.value;
      if (!releaseDate) {
        return null;
      }

      const inputDate = new Date(control.value);
      const baseDate = new Date(releaseDate);
      
      // Calcular la fecha exactamente un año después
      const oneYearAfter = new Date(baseDate);
      oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
      
      // Normalizar las fechas eliminando la parte horaria
      const normalizedInputDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const normalizedOneYearAfter = new Date(oneYearAfter.getFullYear(), oneYearAfter.getMonth(), oneYearAfter.getDate());
      
      // Convertir a formato ISO para comparación exacta
      const inputISO = formatDate(normalizedInputDate, 'yyyy-MM-dd', 'en-US');
      const oneYearAfterISO = formatDate(normalizedOneYearAfter, 'yyyy-MM-dd', 'en-US');
      
      return inputISO === oneYearAfterISO ? null : { invalidRevisionDate: true };
    };
  }
  
  /**
   * Actualiza automáticamente la fecha de revisión cuando cambia la fecha de liberación
   * @param revisionDateControlName Nombre del control de la fecha de revisión
   */
  static autoUpdateRevisionDate(revisionDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const revisionDateControl = control.parent?.get(revisionDateControlName);
      if (!revisionDateControl) {
        return null;
      }

      const releaseDate = new Date(control.value);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);
      
      // Actualizar la fecha de revisión sin disparar validadores
      revisionDateControl.setValue(formatDate(revisionDate, 'yyyy-MM-dd', 'en-US'), { emitEvent: false });
      
      return null;
    };
  }
}
