import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from '../state/favorites.state';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectFavorites = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.items
);

export const selectFavoritesCount = createSelector(
  selectFavorites,
  (favorites) => favorites.length
);

export const selectIsInFavorites = (productId: number) => createSelector(
  selectFavorites,
  (favorites) => favorites.some(item => item.id === productId)
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.error
);
