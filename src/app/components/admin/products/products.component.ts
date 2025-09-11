import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible: boolean = false;
  productForm!: FormGroup;
  categoryList: any[] = [];
  productList: any[] = [];
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  isLoading = false;

  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 1;

  @ViewChild('panelForm') panelForm!: ElementRef;

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productId: [0],
      productSku: ['', Validators.required],
      productName: ['', Validators.required],
      productPrice: [null, [Validators.required, Validators.min(1)]],
      productShortName: ['', Validators.required],
      productDescription: ['', Validators.required],
      createdDate: [new Date()],
      deliveryTime: [''],
      categoryId: [null, Validators.required],
      productImageUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(https?:\/\/[^\s]+)$/)
        ]
      ],
      userId: [0]
    });

    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().pipe(
      finalize(() => (this.isLoading = false))
    ).subscribe((res: any) => {
      this.productList = res.data.sort((a: any, b: any) => b.productId - a.productId);
      this.filteredProducts = [...this.productList];
      this.updatePagination();
    });
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.productList.filter(
      (p) =>
        (p.productName.toLowerCase().includes(term) ||
          p.categoryName.toLowerCase().includes(term)) &&
        (this.selectedCategory === '' || p.categoryName === this.selectedCategory)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get displayPages(): number[] {
    const delta = 2;
    let start = Math.max(1, this.currentPage - delta);
    let end = Math.min(this.totalPages, this.currentPage + delta);
    if (this.currentPage - start < delta) {
      end = Math.min(this.totalPages, end + (delta - (this.currentPage - start)));
    }
    if (end - this.currentPage < delta) {
      start = Math.max(1, start - (delta - (end - this.currentPage)));
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
  }

  resetForm() {
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.closeSidePanel();
      this.productService.saveProduct(this.productForm.value).pipe(
        finalize(() => (this.isLoading = false))
      ).subscribe((res: any) => {
        if (res.result) {
          alert('Product Created successfully');
          this.getAllProducts();
        } else {
          alert(res.message);
        }
      });
    } else {
      this.productForm.markAllAsTouched();
      console.log(this.productForm.value);

    }
  }

  onUpdate() {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.closeSidePanel();
      this.productService.updateProduct(this.productForm.value).pipe(
        finalize(() => (this.isLoading = false))
      ).subscribe((res: any) => {
        if (res.result) {
          alert('Product Updated successfully');
          this.getAllProducts();
        } else {
          alert(res.message);
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onEdit(item: any) {
    this.productForm.patchValue(item);
    this.openSidePanel();
    setTimeout(() => {
      this.panelForm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  onDelete(product: any) {
    const isDelete = confirm('Are you sure want to delete?');
    if (isDelete) {
      this.isLoading = true;
      this.closeSidePanel();
      this.productService.deleteProduct(product.productId).pipe(
        finalize(() => (this.isLoading = false))
      ).subscribe((res: any) => {
        if (res.result) {
          alert('Product Deleted successfully');
          this.getAllProducts();
        } else {
          alert(res.message);
        }
      });
    }
  }
}
