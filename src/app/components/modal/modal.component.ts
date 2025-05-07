import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() cancelButtonText: string = 'Cancelar';
  @Input() confirmButtonClass: string = 'btn-danger';
  @Input() isOpen: boolean = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  constructor(private elementRef: ElementRef) {}

  /**
   * Emite el evento de confirmación
   */
  onConfirm(): void {
    this.confirm.emit();
  }

  /**
   * Emite el evento de cancelación
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Cierra el modal al hacer click en el fondo oscuro
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  /**
   * Cierra el modal al presionar ESC
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.onCancel();
    }
  }
}
