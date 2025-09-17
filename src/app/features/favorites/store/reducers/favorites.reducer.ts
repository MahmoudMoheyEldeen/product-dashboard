import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from '../actions/favorites.actions';
import { FavoritesState, initialState } from '../state/favorites.state';

export const favoritesReducer = createReducer(
  initialState,
  on(FavoritesActions.addToFavorites, (state, { product }) => ({
    ...state,
    items: [...state.items, product]
  })),
  on(FavoritesActions.removeFromFavorites, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.id === productId ? false : true)
  })),
  on(FavoritesActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null
  })),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export const getFavorites = (state: FavoritesState) => state.items;
export const getFavoritesLoading = (state: FavoritesState) => state.loading;
export const getFavoritesError = (state: FavoritesState) => state.error;
