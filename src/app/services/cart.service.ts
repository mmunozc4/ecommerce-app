import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartSubject.next(JSON.parse(savedCart));
      }
    }
  }

  private saveCart(cart: any[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getCart() {
    return this.cartSubject.value;
  }

  addItem(product: any, quantity: number = 1) {
    const cart = [...this.cartSubject.value];
    const index = cart.findIndex(p => p.productId === product.productId);

    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  removeItem(productId: number) {
    const cart = this.cartSubject.value.filter(p => p.productId !== productId);
    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  }
}
