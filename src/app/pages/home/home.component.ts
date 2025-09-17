import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../features/products/models/product.model';
import { ProductsService } from '../../features/products/services/products.service';
import { ProductCarouselComponent } from '../../shared/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, ProductCarouselComponent, ToastModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  currentYear = new Date().getFullYear();
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    public translate: TranslateService,
    private store: Store,
    private messageService: MessageService,
    private productsService: ProductsService
  ) {}

  // Handle add to cart event
  onAddToCart(product: Product): void {
    // Here you would typically dispatch an action to add the product to the cart
    // For now, we'll just show a success message
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.title} has been added to your cart.`,
    });

    // TODO: Uncomment and implement your cart store action
    // this.store.dispatch(addToCart({ product }));
  }

  // Handle add to wishlist event
  onAddToWishlist(product: Product): void {
    // Here you would typically dispatch an action to add the product to the wishlist
    this.messageService.add({
      severity: 'info',
      summary: 'Added to Wishlist',
      detail: `${product.title} has been added to your wishlist.`,
    });

    // TODO: Uncomment and implement your wishlist store action
    // this.store.dispatch(addToWishlist({ product }));
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService.getProducts({ limit: 10 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }
}
