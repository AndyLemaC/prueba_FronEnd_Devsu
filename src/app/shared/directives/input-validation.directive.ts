import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appInputValidation]'
})
export class InputValidationDirective implements OnChanges {
  @Input() appInputValidation!: AbstractControl | null;
  @Input() submitted = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.appInputValidation) {
      return;
    }

    // Escuchar cambios en el control
    if (changes['appInputValidation'] && this.appInputValidation) {
      this.appInputValidation.statusChanges.subscribe(() => {
        this.updateValidationClasses();
      });
    }

    // Actualizar cuando cambia el estado de submitted
    if (changes['submitted']) {
      this.updateValidationClasses();
    }

    this.updateValidationClasses();
  }

  private updateValidationClasses(): void {
    if (!this.appInputValidation) {
      return;
    }

    // Limpiar clases existentes
    this.renderer.removeClass(this.el.nativeElement, 'is-valid');
    this.renderer.removeClass(this.el.nativeElement, 'is-invalid');

    // No aplicar estilos si el control no ha sido tocado y no se ha enviado el formulario
    if (!this.appInputValidation.touched && !this.submitted) {
      return;
    }

    // Aplicar clases basadas en el estado de validación
    if (this.appInputValidation.valid) {
      this.renderer.addClass(this.el.nativeElement, 'is-valid');
    } else if (this.appInputValidation.invalid) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
    }
  }
}
