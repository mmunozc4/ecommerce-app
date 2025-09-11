import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { finalize, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  allCategories: any[] = [];
  filteredCategories: any[] = [];
  newCategoryName: string = '';
  searchTerm: string = '';
  isLoading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.productService.getAllCategories().pipe(
      map((response: any) => response.data),
      finalize(() => (this.isLoading = false))
    ).subscribe({
      next: (categories) => {
        this.allCategories = categories;
        this.filteredCategories = categories;
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;

    const body = { categoryName: this.newCategoryName };

    this.productService.saveCategory(body).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error al crear categoría:', err);
      }
    });
  }

  deleteCategory(category: any) {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    this.productService.deleteCategory(category.categoryId).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error al eliminar categoría:', err);
      }
    });
  }

  filterCategories() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.allCategories.filter(cat =>
      cat.categoryName.toLowerCase().includes(term)
    );
  }
}
