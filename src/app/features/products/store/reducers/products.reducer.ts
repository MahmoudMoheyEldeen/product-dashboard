import { createReducer, on } from '@ngrx/store';
import { initialProductsState, ProductsState } from '../state/products.state';
import * as ProductsActions from '../actions/products.actions';

export const productsReducer = createReducer(
  initialProductsState,
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.loadProductsSuccess, (state, { products, total, page, limit }) => ({
    ...state,
    products,
    total,
    page,
    limit,
    loading: false,
    error: null,
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductsActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedProduct: null,
  })),
  on(ProductsActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    selectedProduct: product,
    error: null,
  })),
  on(ProductsActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductsActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    page: 1, // Reset to first page when filters change
  })),
  on(ProductsActions.resetFilters, (state) => ({
    ...state,
    filters: null,
    page: 1,
  }))
);

export function reducer(state: ProductsState | undefined, action: any) {
  return productsReducer(state, action);
}
