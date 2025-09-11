import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faShoppingCart, faUser, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faSearch = faSearch;
  faUser = faUser;
  faTimes = faTimes;
  faTrash = faTrash;

  productList: any[] = [];
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];
  categoryList: any[] = [];
  isLoading = false;
  searchTerm: string = '';
  selectedCategory: string = '';
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  isModalOpen = false;
  selectedProduct: any = null;
  selectedQuantity: number = 1;
  cart: any[] = [];

  showCartDropdown = false;


  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();

    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  getAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.productList = (res && res.data) ? res.data : [];
          this.productList.sort((a: any, b: any) => (b.productId ?? 0) - (a.productId ?? 0));
          this.applyFiltersAndPagination();
        },
        error: (err) => {
          console.error('Error cargando productos:', err);
          this.productList = [];
          this.applyFiltersAndPagination();
        }
      });
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categoryList = (res && res.data) ? res.data : [];
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.categoryList = [];
      }
    });
  }

  filterProducts() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
    setTimeout(() => window.scrollTo({ top: 150, behavior: 'smooth' }), 50);
  }

  private applyFiltersAndPagination() {
    const term = (this.searchTerm || '').toString().trim().toLowerCase();

    this.filteredProducts = this.productList.filter((p: any) => {
      const name = (p.productName || '').toString().toLowerCase();
      const cat = (p.categoryName || '').toString().toLowerCase();

      const matchesSearch = !term || name.includes(term) || cat.includes(term);
      const matchesCategory = !this.selectedCategory || p.categoryName === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    this.updatePage();
  }

  private updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  get displayPages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    if (total <= 1) return [];
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    if (current - start < delta) {
      end = Math.min(total, end + (delta - (current - start)));
    }
    if (end - current < delta) {
      start = Math.max(1, start - (delta - (end - current)));
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  openProductModal(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  addToCart() {
    if (!this.selectedProduct) return;

    this.cartService.addItem(this.selectedProduct, this.selectedQuantity);

    alert(`${this.selectedProduct.productName} agregado al carrito (x${this.selectedQuantity})`);
    this.closeModal();
  }

  removeFromCart(productId: number){
    this.cartService.removeItem(productId)
    alert("Producto eliminado del carrito");
  }

  goToCheckout() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/shop/checkout']);
    this.closeModal();
  }
}
