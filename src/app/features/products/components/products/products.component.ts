import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
// Custom pipe removed in favor of direct implementation
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ProductsResponse } from '../../models/product.model';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    RatingModule,
    InputTextModule,
    DropdownModule,
    ProgressSpinnerModule,
    PaginatorModule,
    FormsModule,
    TranslateModule,
    TitleCasePipe,
  ],
  templateUrl: './products.component.html',
  styles: [
    `
      /* Search Bar Styles */
      .search-container {
        position: relative;
        min-width: 280px;
        max-width: 500px;
        margin: 0 auto;
      }

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        overflow: hidden;

        &:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        &:hover:not(:focus-within) {
          border-color: #9ca3af;
        }
      }

      .search-icon {
        position: absolute;
        left: 12px;
        color: #9ca3af;
        font-size: 1rem;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 0.625rem 1rem 0.625rem 2.5rem;
        border: none;
        background: transparent;
        font-size: 0.9375rem;
        color: #1f2937;
        outline: none;

        &::placeholder {
          color: #9ca3af;
        }

        &:-ms-input-placeholder {
          color: #9ca3af;
        }

        &::-ms-input-placeholder {
          color: #9ca3af;
        }
      }

      .clear-search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #6b7280;
        }

        i {
          font-size: 1rem;
        }
      }

      /* Sort Dropdown Styles */
      .sort-container {
        position: relative;
        min-width: 220px;
      }

      .sort-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        height: 44px;

        &:hover {
          border-color: #9ca3af;
        }

        &:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      }

      .sort-icon {
        position: absolute;
        left: 12px;
        color: #9ca3af;
        font-size: 1rem;
        pointer-events: none;
      }

      .sort-select {
        width: 100%;
        padding: 0.625rem 2.5rem 0.625rem 2.5rem;
        border: none;
        background: transparent;
        font-size: 0.9375rem;
        color: #1f2937;
        appearance: none;
        cursor: pointer;
        outline: none;

        &::-ms-expand {
          display: none;
        }
      }

      .sort-arrow {
        position: absolute;
        right: 12px;
        color: #9ca3af;
        font-size: 0.8rem;
        pointer-events: none;
      }
      .pagination-container {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .pagination {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
      }

      .pagination-arrow,
      .pagination-page {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        background-color: white;
        color: #4b5563;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:hover:not(:disabled) {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
      }

      .pagination-ellipsis {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        color: #6b7280;
      }

      .rows-per-page {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #4b5563;
        font-size: 0.875rem;

        .rows-selector {
          padding: 0.375rem 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background-color: white;
          color: #4b5563;
          cursor: pointer;

          &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }
        }
      }

      @media (max-width: 640px) {
        .pagination {
          gap: 0.25rem;
        }

        .pagination-arrow,
        .pagination-page,
        .pagination-ellipsis {
          width: 2rem;
          height: 2rem;
          font-size: 0.75rem;
        }
      }
    `,
  ],
  styleUrls: ['./products.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  page = 1;
  limit = 8;
  totalProducts = 0;
  totalPages = 0;
  rowsPerPageOptions = [8, 16, 24, 32];
  maxVisiblePages = 5; // Maximum number of page buttons to show at once

  // Search and filter
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  sortOptions: Array<{
    label: string;
    value: 'price' | 'rating' | 'none';
    direction: 'asc' | 'desc' | 'none';
  }> = [
    { label: 'Featured', value: 'none', direction: 'none' },
    { label: 'Price: Low to High', value: 'price', direction: 'asc' },
    { label: 'Price: High to Low', value: 'price', direction: 'desc' },
    { label: 'Rating: High to Low', value: 'rating', direction: 'desc' },
    { label: 'Rating: Low to High', value: 'rating', direction: 'asc' },
  ];
  selectedSort = this.sortOptions[0];

  selectedCategory: string | null = null;

  // Default fallback image URL
  private defaultImageUrl = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  /**
   * Truncates text to a specified length and adds ellipsis if needed
   * @param text The text to truncate
   * @param maxLength Maximum length before truncation
   * @returns Truncated text with ellipsis if needed
   */
  truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  /**
   * Handles image loading errors by setting a fallback image
   * @param event The error event
   * @param product The product containing the image
   */
  handleImageError(event: Event, product: Product): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement.src !== this.defaultImageUrl) {
      imgElement.src = this.defaultImageUrl;
      // Update the product's image URL to prevent flickering on re-renders
      product.image = this.defaultImageUrl;
    }
  }

  ngOnInit(): void {
    // Handle query parameter changes
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.selectedCategory = params['category'] || null;
        this.page = 1; // Reset to first page when category changes
        this.loadProducts();
      });

    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after the last event before emitting
        distinctUntilChanged(), // Only emit if value is different from previous
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page = 1; // Reset to first page when search changes
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Called when user types in the search input
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery.trim().toLowerCase());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchInput();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService
      .getProducts({
        page: this.page,
        limit: this.limit,
        category: this.selectedCategory,
        searchQuery: this.searchQuery.trim(),
        sortField:
          this.selectedSort.value === 'none'
            ? undefined
            : this.selectedSort.value,
        sortDirection:
          this.selectedSort.direction === 'none'
            ? undefined
            : (this.selectedSort.direction as 'asc' | 'desc'),
      })
      .subscribe({
        next: (response: ProductsResponse) => {
          this.products = response.products;
          this.totalProducts = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
        },
      });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: (response: any) => {
        console.log('Product added to cart:', response);
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);
        // Error is already handled in the service with Swal
      }
    });
  }

  onAddToFavorites(product: Product): void {
    // This would dispatch an action to add the product to favorites
    console.log('Add to favorites:', product);
  }

  onSortChange(): void {
    this.page = 1; // Reset to first page when sort changes
    this.loadProducts();
  }

  // Pagination methods
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onRowsPerPageChange(): void {
    this.page = 1; // Reset to first page when changing rows per page
    this.loadProducts();
  }

  // Get the range of page numbers to display
  getPageRange(): number[] {
    const range = [];
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    // Adjust if we're near the end
    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  // Show first page button if needed
  showFirstPage(): boolean {
    return this.page > 3 && this.totalPages > this.maxVisiblePages;
  }

  // Show last page button if needed
  showLastPage(): boolean {
    return (
      this.page < this.totalPages - 2 && this.totalPages > this.maxVisiblePages
    );
  }

  // Show ellipsis after first page if needed
  showFirstEllipsis(): boolean {
    return this.page > 3 && this.totalPages > this.maxVisiblePages;
  }

  // Show ellipsis before last page if needed
  showLastEllipsis(): boolean {
    return (
      this.page < this.totalPages - 2 && this.totalPages > this.maxVisiblePages
    );
  }

  clearCategoryFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge',
    });
  }
}
