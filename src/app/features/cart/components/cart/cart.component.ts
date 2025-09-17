import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CartItem, CartProduct } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    RippleModule,
    TranslateModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  get totalItems(): number {
    return this.cartItems.reduce(
      (total, cart) =>
        total + cart.products.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (total, cart) =>
        total +
        cart.products.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      0
    );
  }

  getCartSubtotal(cart: CartItem): number {
    return cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.loading = true;
    this.error = null;

    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.cartItems = items;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading cart:', err);
          this.error = 'Failed to load cart. Please try again later.';
          this.loading = false;
        },
      });
  }

  removeItem(cartId: number, productId: number): void {
    this.cartService
      .removeFromCart(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Cart items will be updated via the service's state
        },
        error: (err) => {
          console.error('Error removing item:', err);
        },
      });
  }

  updateQuantity(cartId: number, product: CartProduct, quantity: number): void {
    if (quantity > 0) {
      this.cartService
        .updateCartItemQuantity(cartId, product.id, quantity)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Cart items will be updated via the service's state
          },
          error: (err) => {
            console.error('Error updating quantity:', err);
          },
        });
    } else {
      this.removeItem(cartId, product.id);
    }
  }

  clearCart(): void {
    this.cartService
      .clearCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Cart will be cleared via the service's state
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
        },
      });
  }

  trackByProductId(index: number, item: CartProduct): number {
    return item.id;
  }
}
