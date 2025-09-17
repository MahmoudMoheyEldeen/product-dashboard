import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from '../state/products.state';
import { Product } from '../../models/product.model';

const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProducts = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products
);

export const selectProduct = createSelector(
  selectProductsState,
  (state: ProductsState) => state.selectedProduct
);

export const selectLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.loading
);

export const selectError = createSelector(
  selectProductsState,
  (state: ProductsState) => state.error
);

export const selectFilters = createSelector(
  selectProductsState,
  (state: ProductsState) => state.filters
);

export const selectPagination = createSelector(
  selectProductsState,
  (state: ProductsState) => ({
    page: state.page,
    limit: state.limit,
    total: state.total,
    totalPages: Math.ceil(state.total / state.limit)
  })
);

export const selectFilteredProducts = createSelector(
  selectProducts,
  selectFilters,
  (products: Product[], filters: any) => {
    if (!filters) return products;
    
    return products.filter(product => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filter by price range
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description.toLowerCase().includes(searchTerm);
        
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }
      
      return true;
    });
  }
);
