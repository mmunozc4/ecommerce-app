import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: any[] = [];
  total: number = 0;
  showConfirmationModal = false;
  orderSummary: any = {};
  cardType: string = 'generic';
  faTrash = faTrash;

  months = [
    { value: '01', label: '01 - Enero' },
    { value: '02', label: '02 - Febrero' },
    { value: '03', label: '03 - Marzo' },
    { value: '04', label: '04 - Abril' },
    { value: '05', label: '05 - Mayo' },
    { value: '06', label: '06 - Junio' },
    { value: '07', label: '07 - Julio' },
    { value: '08', label: '08 - Agosto' },
    { value: '09', label: '09 - Septiembre' },
    { value: '10', label: '10 - Octubre' },
    { value: '11', label: '11 - Noviembre' },
    { value: '12', label: '12 - Diciembre' }
  ];

  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      cardExpiryMonth: [''],
      cardExpiryYear: [''],
      cardCvv: [''],
      bankName: [''],
      transactionId: ['']
    });

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.total = this.cartService.getTotal();
    });
  }

  formatCardNumber(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    input = input.substring(0, 16);
    let formatted = input.match(/.{1,4}/g)?.join('-') || '';
    event.target.value = formatted;
    this.checkoutForm.patchValue({ cardNumber: formatted }, { emitEvent: false });
  }

  removeFromCart(productId: number) {
    this.cartService.removeItem(productId)
    alert("Producto eliminado del carrito");
  }

  confirmOrder() {
    if (this.checkoutForm.invalid) {
      alert('Por favor completa todos los campos del formulario.');
      return;
    }
    if (this.cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const cardExpiry = `${this.checkoutForm.get('cardExpiryMonth')?.value}/${this.checkoutForm.get('cardExpiryYear')?.value}`;

    this.orderSummary = {
      id: Date.now(),
      customer: {
        ...this.checkoutForm.value,
        cardExpiry: cardExpiry
      },
      items: this.cart,
      total: this.total,
      date: new Date().toLocaleString()
    };

    this.showConfirmationModal = true;
  }

  closeModal() {
    this.showConfirmationModal = false;
    this.cartService.clearCart();
    this.router.navigate(['/shop']);
  }

  cancelarOrden() {
    this.router.navigate(['/shop']);
  }
}
