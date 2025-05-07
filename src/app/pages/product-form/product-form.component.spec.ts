import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Product } from '../../models/product';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let idValidatorServiceSpy: jasmine.SpyObj<IdValidatorService>;
  let errorHandlerServiceSpy: jasmine.SpyObj<ErrorHandlerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: 'test123',
    name: 'Test Product',
    description: 'This is a test product',
    logo: 'logo.png',
    date_release: '2025-05-10',
    date_revision: '2026-05-10'
  };

  beforeEach(async () => {
    // Create spies for all dependencies
    productServiceSpy = jasmine.createSpyObj('ProductService', 
      ['getProducts', 'createProduct', 'updateProduct']);
    idValidatorServiceSpy = jasmine.createSpyObj('IdValidatorService', 
      ['validateUniqueId']);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', 
      ['handleError', 'showSuccess']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Setup return values
    productServiceSpy.getProducts.and.returnValue(of([mockProduct]));
    productServiceSpy.createProduct.and.returnValue(of({ 
      message: 'Product added successfully', 
      data: mockProduct 
    }));
    productServiceSpy.updateProduct.and.returnValue(of({ 
      message: 'Product updated successfully', 
      data: mockProduct 
    }));
    idValidatorServiceSpy.validateUniqueId.and.returnValue(() => of(null));

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: IdValidatorService, useValue: idValidatorServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: null }))
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('logo')?.value).toBe('');
      expect(component.productForm.get('date_release')?.value).toBe('');
      expect(component.productForm.get('date_revision')?.disabled).toBeTrue();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const idControl = component.productForm.get('id');
      const nameControl = component.productForm.get('name');
      const descriptionControl = component.productForm.get('description');
      const logoControl = component.productForm.get('logo');
      const dateReleaseControl = component.productForm.get('date_release');
      
      idControl?.setValue('');
      nameControl?.setValue('');
      descriptionControl?.setValue('');
      logoControl?.setValue('');
      dateReleaseControl?.setValue('');
      
      expect(idControl?.valid).toBeFalse();
      expect(nameControl?.valid).toBeFalse();
      expect(descriptionControl?.valid).toBeFalse();
      expect(logoControl?.valid).toBeFalse();
      expect(dateReleaseControl?.valid).toBeFalse();
      expect(component.productForm.valid).toBeFalse();
    });

    it('should validate length constraints', () => {
      const idControl = component.productForm.get('id');
      const nameControl = component.productForm.get('name');
      const descriptionControl = component.productForm.get('description');
      
      // ID too short
      idControl?.setValue('ab');
      expect(idControl?.valid).toBeFalse();
      
      // ID valid
      idControl?.setValue('abc');
      expect(idControl?.hasError('minlength')).toBeFalse();
      
      // ID too long
      idControl?.setValue('abcdefghijk'); // 11 chars
      expect(idControl?.valid).toBeFalse();
      
      // Name too short
      nameControl?.setValue('abcd');
      expect(nameControl?.valid).toBeFalse();
      
      // Name valid
      nameControl?.setValue('abcde');
      expect(nameControl?.hasError('minlength')).toBeFalse();
      
      // Description too short
      descriptionControl?.setValue('abcdefghi');
      expect(descriptionControl?.valid).toBeFalse();
      
      // Description valid
      descriptionControl?.setValue('abcdefghij');
      expect(descriptionControl?.hasError('minlength')).toBeFalse();
    });
  });

  describe('Form Submission', () => {
    it('should call createProduct when submitting in create mode', () => {
      component.isEditMode = false;
      component.productForm.setValue({
        id: 'new123',
        name: 'New Product',
        description: 'New product description',
        logo: 'new-logo.png',
        date_release: '2025-06-01',
        date_revision: '2026-06-01'
      });
      
      component.onSubmit();
      
      expect(productServiceSpy.createProduct).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
    });
    
    it('should handle errors during product creation', () => {
      productServiceSpy.createProduct.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      
      component.isEditMode = false;
      component.productForm.setValue({
        id: 'new123',
        name: 'New Product',
        description: 'New product description',
        logo: 'new-logo.png',
        date_release: '2025-06-01',
        date_revision: '2026-06-01'
      });
      
      component.onSubmit();
      
      expect(errorHandlerServiceSpy.showError).toHaveBeenCalled();
    });
  });

  describe('Reset Form', () => {
    it('should reset form values when resetForm is called', () => {
      component.isEditMode = false;
      component.productForm.setValue({
        id: 'test123',
        name: 'Test',
        description: 'Test description',
        logo: 'test.png',
        date_release: '2025-06-01',
        date_revision: '2026-06-01'
      });
      
      component.resetForm();
      
      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.submitted).toBeFalse();
    });
  });
});