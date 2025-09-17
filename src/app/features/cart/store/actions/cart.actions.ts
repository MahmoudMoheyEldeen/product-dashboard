import { createAction, props } from '@ngrx/store';
import { Product } from '../../../products/models/product.model';
import { CartItem } from '../../models/cart.model';

export const loadCart = createAction('[Cart] Load Cart');

export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: CartItem[] }>()
);

export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product; quantity?: number }>()
);

export const addToCartSuccess = createAction(
  '[Cart] Add To Cart Success',
  props<{ item: CartItem }>()
);

export const addToCartFailure = createAction(
  '[Cart] Add To Cart Failure',
  props<{ error: string }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>()
);

export const removeFromCartSuccess = createAction(
  '[Cart] Remove From Cart Success',
  props<{ productId: number }>()
);

export const removeFromCartFailure = createAction(
  '[Cart] Remove From Cart Failure',
  props<{ error: string }>()
);

export const updateCartItemQuantity = createAction(
  '[Cart] Update Cart Item Quantity',
  props<{ cartId: number; productId: number; quantity: number }>()
);

export const updateCartItemQuantitySuccess = createAction(
  '[Cart] Update Cart Item Quantity Success',
  props<{ cartId: number; productId: number; quantity: number }>()
);

export const updateCartItemQuantityFailure = createAction(
  '[Cart] Update Cart Item Quantity Failure',
  props<{ error: string }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const clearCartSuccess = createAction('[Cart] Clear Cart Success');

export const clearCartFailure = createAction(
  '[Cart] Clear Cart Failure',
  props<{ error: string }>()
);
