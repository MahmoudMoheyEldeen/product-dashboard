import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../features/products/models/product.model';
import { interval, Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
})
export class ProductCarouselComponent implements OnChanges, OnInit, OnDestroy {
  @Input() products: Product[] = [];
  @Input() autoSlide = true;
  @Input() slideInterval = 3000; // Default to 3 seconds
  
  currentIndex = 0;
  visibleProducts: Product[] = [];
  itemsPerSlide = 3;
  private autoSlideSubscription?: Subscription;
  
  // Emit events for cart and wishlist actions
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    if (!this.autoSlide) return;
    
    this.stopAutoSlide(); // Clear any existing interval
    
    this.autoSlideSubscription = interval(this.slideInterval).subscribe(() => {
      if (this.showNextButton) {
        // Use the appropriate direction based on language
        if (this.translate.currentLang === 'ar') {
          this.prevAction();
        } else {
          this.nextAction();
        }
      } else {
        this.currentIndex = 0; // Reset to first slide
      }
      this.updateVisibleProducts();
    });
  }

  private stopAutoSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products) {
      this.updateVisibleProducts();
      if (this.autoSlide) {
        this.startAutoSlide();
      }
    }
    
    if (changes['autoSlide'] || changes['slideInterval']) {
      if (this.autoSlide) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    }
  }

  next(): void {
    // In RTL mode, next and previous are reversed
    if (this.translate.currentLang === 'ar') {
      this.prevAction();
    } else {
      this.nextAction();
    }
  }

  private nextAction(): void {
    if (this.currentIndex < this.products.length - this.itemsPerSlide) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to start
    }
    this.updateVisibleProducts();
    
    // Reset auto-slide timer on manual navigation
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  prev(): void {
    // In RTL mode, next and previous are reversed
    if (this.translate.currentLang === 'ar') {
      this.nextAction();
    } else {
      this.prevAction();
    }
  }

  private prevAction(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      // If at the start, go to the last slide
      this.currentIndex = Math.max(0, this.products.length - this.itemsPerSlide);
    }
    this.updateVisibleProducts();
    
    // Reset auto-slide timer on manual navigation
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  private updateVisibleProducts(): void {
    if (!this.products?.length) {
      this.visibleProducts = [];
      return;
    }
    
    // Ensure we don't go out of bounds
    const endIndex = Math.min(this.currentIndex + this.itemsPerSlide, this.products.length);
    this.visibleProducts = this.products.slice(this.currentIndex, endIndex);
    
    // If we're at the end and have less than itemsPerSlide, show from the beginning
    if (this.visibleProducts.length < this.itemsPerSlide && this.products.length > this.itemsPerSlide) {
      const remaining = this.itemsPerSlide - this.visibleProducts.length;
      this.visibleProducts = [
        ...this.visibleProducts,
        ...this.products.slice(0, remaining)
      ];
    }
  }

  get showPrevButton(): boolean {
    return this.currentIndex > 0;
  }

  // Calculate the number of pages for pagination
  get totalPages(): number {
    return Math.ceil((this.products?.length || 0) / this.itemsPerSlide);
  }

  // Get current page number (0-based)
  currentPage(): number {
    return Math.floor(this.currentIndex / this.itemsPerSlide);
  }

  // Generate array of page indices for pagination indicators
  getPageIndices(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  // Navigate to specific page
  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentIndex = pageIndex * this.itemsPerSlide;
      this.updateVisibleProducts();
      if (this.autoSlide) {
        this.startAutoSlide();
      }
    }
  }

  // Add item to cart
  onAddToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(product);
  }

  // Add item to wishlist
  onAddToWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    this.addToWishlist.emit(product);
  }

  // Check if next button should be shown
  get showNextButton(): boolean {
    return this.currentIndex < (this.products?.length || 0) - this.itemsPerSlide;
  }
}
