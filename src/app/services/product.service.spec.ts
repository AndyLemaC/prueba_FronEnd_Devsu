import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProduct: Product = {
    id: 'test123',
    name: 'Test Product',
    description: 'This is a test product',
    logo: 'logo.png',
    date_release: '2025-05-10',
    date_revision: '2026-05-10'
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from the API', () => {
      const mockResponse = {
        data: [mockProduct]
      };

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0]).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${apiUrl}/bp/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createProduct', () => {
    it('should send POST request to create a product', () => {
      const mockResponse = {
        message: 'Product added successfully',
        data: mockProduct
      };

      service.createProduct(mockProduct).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/bp/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockResponse);
    });
  });

  describe('updateProduct', () => {
    it('should send PUT request to update a product', () => {
      const mockResponse = {
        message: 'Product updated successfully',
        data: mockProduct
      };
  
      service.updateProduct(mockProduct).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
  
      const req = httpMock.expectOne(`${apiUrl}/bp/products/${mockProduct.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('deleteProduct', () => {
    it('should send DELETE request to remove a product', () => {
      const mockResponse = {
        message: 'Product removed successfully',
        data: null
      };

      service.deleteProduct('test123').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/bp/products/test123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('verifyProductId', () => {
    it('should check if product ID exists', () => {
      service.verifyProductId('test123').subscribe(exists => {
        expect(exists).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/bp/products/verification/test123`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false when product ID does not exist', () => {
      service.verifyProductId('nonexistent').subscribe(exists => {
        expect(exists).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrl}/bp/products/verification/nonexistent`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });
});
