import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ProductsState } from './features/products/store/state/products.state';
import { CartState } from './features/cart/store/state/cart.state';
import { FavoritesState } from './features/favorites/store/state/favorites.state';
import { CategoriesState } from './features/categories/store/state/categories.state';

export interface AppState {
  router: RouterReducerState;
  products: ProductsState;
  cart: CartState;
  favorites: FavoritesState;
  categories: CategoriesState;
}

export const appReducers = {
  router: routerReducer,
};
