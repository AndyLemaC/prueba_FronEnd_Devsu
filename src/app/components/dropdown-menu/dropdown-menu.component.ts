import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface MenuOption {
  label: string;
  action: 'edit' | 'delete' | string;
  icon?: string;
}

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent {
  @Input() options: MenuOption[] = [];
  @Output() optionSelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  isOpen = false;
  
  constructor(private elementRef: ElementRef) {}

  /**
   * Maneja la acción cuando se selecciona una opción
   * @param action Acción seleccionada
   */
  onSelect(action: string): void {
    this.optionSelected.emit(action);
    this.isOpen = false;
  }

  /**
   * Alterna la apertura/cierre del dropdown
   */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  /**
   * Cierra el dropdown al hacer click fuera de él
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.close.emit();
    }
  }
}