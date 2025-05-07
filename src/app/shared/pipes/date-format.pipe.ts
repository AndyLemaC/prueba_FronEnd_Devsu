import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format: string = 'short'): string {
    if (!value) {
      return '';
    }
    
    const date = new Date(value);
    
    switch (format) {
      case 'short':
        return this.formatShort(date);
      case 'long':
        return this.formatLong(date);
      case 'input':
        return this.formatInput(date);
      default:
        return this.formatShort(date);
    }
  }
  
  private formatShort(date: Date): string {
    // Formato: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  private formatLong(date: Date): string {
    // Formato: DD de Mes de YYYY
    const day = date.getDate();
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }
  
  private formatInput(date: Date): string {
    // Formato: YYYY-MM-DD (para inputs type="date")
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }
}
