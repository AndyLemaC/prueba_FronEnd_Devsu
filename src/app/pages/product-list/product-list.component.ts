import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from '../../services/product.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20];
  currentPage: number = 1;
  isLoading: boolean = true;
  isModalVisible: boolean = false;
  productToDelete: Product | null = null;

  constructor(
    private productService: ProductService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log(this.products);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorHandler.showError('Error al cargar los productos');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.id.toLowerCase().includes(term) ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
    
    // Resetear a la primera página cuando cambian los filtros
    this.currentPage = 1;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Resetear a la primera página
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onEditProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.isModalVisible = true;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.errorHandler.showSuccess('Producto eliminado con éxito');
        },
        error: (error) => {
          this.errorHandler.showError('Error al eliminar el producto');
          console.error(error);
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.productToDelete = null;
  }

  handleDropdownToggle(event: MouseEvent, product: Product): void {
    event.stopPropagation(); // Detiene la propagación del evento
    
    // Cierra todos los otros dropdowns antes de abrir otro
    this.paginatedProducts.forEach(p => {
      if (p !== product && p['showDropdown']) {
        p['showDropdown'] = false;
      }
    });
    
    // Toggle el dropdown actual
    if (product['showDropdown'] === undefined) {
      product['showDropdown'] = true;
    } else {
      product['showDropdown'] = !product['showDropdown'];
    }
  }
  
  // Método para manejar la selección de una opción
  handleOptionSelected(action: string, product: Product): void {
    if (action === 'edit') {
      this.onEditProduct(product);
    } else if (action === 'delete') {
      this.onDeleteProduct(product);
    }
    product['showDropdown'] = false;
  }
}