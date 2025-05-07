import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CustomValidators } from '../../shared/validators/custom-validators.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  productId: string | null = null;
  submitted = false;
  minDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD para hoy

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private idValidator: IdValidatorService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición (existe un ID en la ruta)
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      
      if (this.productId) {
        this.isEditMode = true;
        this.loadProductData(this.productId);
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: this.isEditMode }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ], this.isEditMode ? null : [this.idValidator.validateUniqueId()]],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: ['', [Validators.required]],
      date_release: ['', [
        Validators.required,
        CustomValidators.futureDateValidator()
      ]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
    });

    // Actualizar fecha de revisión automáticamente al cambiar fecha de liberación
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(releaseDate.getFullYear() + 1);
        
        this.productForm.get('date_revision')?.setValue(
          revisionDate.toISOString().split('T')[0]
        );
      } else {
        this.productForm.get('date_revision')?.setValue('');
      }
    });
  }

  loadProductData(id: string): void {
    this.isLoading = true;
    this.productService.getProducts()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (products) => {
          const product = products.find(p => p.id === id);
          if (product) {
            // Formatear fechas al formato YYYY-MM-DD
            const formattedProduct = {
              ...product,
              date_release: new Date(product.date_release).toISOString().split('T')[0],
              date_revision: new Date(product.date_revision).toISOString().split('T')[0]
            };
            
            // Actualizar el formulario con los datos del producto
            this.productForm.patchValue({
              name: formattedProduct.name,
              description: formattedProduct.description,
              logo: formattedProduct.logo,
              date_release: formattedProduct.date_release,
              date_revision: formattedProduct.date_revision
            });
            
            // Mantener el ID en una variable para la actualización
            this.productId = product.id;
          } else {
            this.errorHandler.showError('Producto no encontrado');
            this.router.navigate(['/products']);
          }
        },
        error: (error) => {
          this.errorHandler.showError('Error al cargar el producto ');
          console.error(error);
          this.router.navigate(['/products']);
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.productForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    const formData = this.productForm.getRawValue();
    const product: Product = {
      id: this.isEditMode ? this.productId! : formData.id,
      name: formData.name,
      description: formData.description,
      logo: formData.logo,
      date_release: formData.date_release,
      date_revision: formData.date_revision
    };
    
    if (this.isEditMode) {
      this.updateProduct(product);
    } else {
      this.createProduct(product);
    }
  }
  
  createProduct(product: Product): void {
    this.productService.createProduct(product)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.errorHandler.showSuccess('Producto creado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.errorHandler.showError('Error al crear el producto');
          console.error(error);
        }
      });
  }
  
  updateProduct(product: Product): void {
    this.productService.updateProduct(product)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.errorHandler.showSuccess('Producto actualizado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.errorHandler.showError('Error al actualizar el producto ');
          console.error(error);
        }
      });
  }
  
  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode) {
      this.loadProductData(this.productId!);
    } else {
      this.productForm.reset();
      // Restablecer las validaciones
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.setErrors(null);
      });
    }
  }
  
  // Helpers para el manejo de errores en el template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return (control?.invalid ?? false) && 
           (control?.touched ?? false) && 
           (control?.hasError(errorName) ?? false);
  }
  
  controlInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return (control?.invalid ?? false) && 
           ((control?.touched ?? false) || this.submitted);
  }
  
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
