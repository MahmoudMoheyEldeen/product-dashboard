import { createAction, props } from '@ngrx/store';
import { Product } from '../../../../features/products/models/product.model';

export const addToFavorites = createAction(
  '[Favorites] Add to Favorites',
  props<{ product: Product }>()
);

export const removeFromFavorites = createAction(
  '[Favorites] Remove from Favorites',
  props<{ productId: number }>()
);

export const loadFavorites = createAction('[Favorites] Load Favorites');

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ items: Product[] }>()
);

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: string }>()
);
