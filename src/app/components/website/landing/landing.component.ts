import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faUser, faBars, faStar, faTruck, faFire } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  faBars = faBars;
  faStar = faStar;
  faTruck = faTruck;
  faFire = faFire;

  productList: any[] = [];
  isLoading: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res: any) => {
        this.productList = res.data
          .filter((p: any) => this.isValidImageUrl(p.productImageUrl))
          .sort((a: any, b: any) => b.productId - a.productId)
          .slice(0, 10);
      });
  }

  private isValidImageUrl(url: string): boolean {
    if (!url) return false;
    const regex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;

    return regex.test(url.trim());
  }
}
