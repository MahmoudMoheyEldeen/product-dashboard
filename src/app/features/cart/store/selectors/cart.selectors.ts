import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState, initialCartState } from '../state/cart.state';
import { CartItem } from '../../models/cart.model';

const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state.error
);

export const selectCartLastUpdated = createSelector(
  selectCartState,
  (state: CartState) => state.lastUpdated
);

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((count, item) => {
    const itemCount = item.products.reduce((productCount, product) => productCount + product.quantity, 0);
    return count + itemCount;
  }, 0)
);

export const selectCartSubtotal = createSelector(
  selectCartItems,
  (items: CartItem[]) => 
    items.reduce((sum, item) => {
      const itemTotal = item.products.reduce((productSum, product) => 
        productSum + (product.price * product.quantity), 0);
      return sum + itemTotal;
    }, 0)
);

export const selectCartItem = (productId: number) => 
  createSelector(
    selectCartItems,
    (items: CartItem[]) => {
      for (const item of items) {
        const product = item.products.find(p => p.id === productId);
        if (product) return item;
      }
      return undefined;
    }
  );

export const selectIsInCart = (productId: number) =>
  createSelector(
    selectCartItems,
    (items: CartItem[]) => items.some(item => 
      item.products.some(product => product.id === productId)
    )
  );

export const selectCartTotalItems = createSelector(
  selectCartItems,
  (items: CartItem[]) => items.reduce((total, item) => {
    const itemCount = item.products.reduce((productCount, product) => productCount + product.quantity, 0);
    return total + itemCount;
  }, 0)
);

export const selectCartTotalPrice = createSelector(
  selectCartItems,
  (items: CartItem[]) => 
    items.reduce((total, item) => {
      const itemTotal = item.products.reduce((productSum, product) => 
        productSum + (product.price * product.quantity), 0);
      return total + itemTotal;
    }, 0)
);
