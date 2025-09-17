import { createAction, props } from '@ngrx/store';
import { Product, ProductFilters } from '../../models/product.model';

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ page: number; limit: number; filters?: ProductFilters }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; total: number; page: number; limit: number }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const loadProduct = createAction(
  '[Products] Load Product',
  props<{ id: string }>()
);

export const loadProductSuccess = createAction(
  '[Products] Load Product Success',
  props<{ product: Product }>()
);

export const loadProductFailure = createAction(
  '[Products] Load Product Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[Products] Update Filters',
  props<{ filters: ProductFilters }>()
);

export const resetFilters = createAction('[Products] Reset Filters');

export const addToFavorites = createAction(
  '[Products] Add To Favorites',
  props<{ productId: string }>()
);

export const removeFromFavorites = createAction(
  '[Products] Remove From Favorites',
  props<{ productId: string }>()
);
