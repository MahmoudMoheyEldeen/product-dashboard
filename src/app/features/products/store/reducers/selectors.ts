import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from '../state/products.state';

const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProductsList = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state: ProductsState) => state.selectedProduct
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state: ProductsState) => state.error
);

export const selectProductsFilters = createSelector(
  selectProductsState,
  (state: ProductsState) => state.filters
);

export const selectProductsPagination = createSelector(
  selectProductsState,
  (state: ProductsState) => ({
    page: state.page,
    limit: state.limit,
    total: state.total,
    totalPages: Math.ceil(state.total / state.limit) || 1,
  })
);

export const selectFullProductsState = createSelector(
  selectProductsState,
  (state: ProductsState) => state
);
