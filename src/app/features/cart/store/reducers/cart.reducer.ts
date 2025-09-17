import { createReducer, on } from '@ngrx/store';
import * as CartActions from '../actions/cart.actions';
import { initialCartState, CartState } from '../state/cart.state';

export const cartReducer = createReducer(
  initialCartState,

  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null,
    lastUpdated: new Date(),
  })),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add to Cart
  on(CartActions.addToCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.addToCartSuccess, (state, { item }) => {
    const existingItemIndex = state.items.findIndex(
      (i) => i.products[0]?.id === item.products[0]?.id
    );

    const updatedItems = [...state.items];

    if (existingItemIndex > -1) {
      const updatedProducts = [...updatedItems[existingItemIndex].products];
      updatedProducts[0] = {
        ...updatedProducts[0],
        quantity: updatedProducts[0].quantity + (item.products[0]?.quantity || 1)
      };
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        products: updatedProducts
      };
    } else {
      updatedItems.push({
        ...item,
        products: item.products.map((p) => ({
          ...p,
          quantity: p.quantity || 1,
        })),
      });
    }

    return {
      ...state,
      items: updatedItems,
      loading: false,
      lastUpdated: new Date(),
    };
  }),

  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove from Cart
  on(CartActions.removeFromCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.removeFromCartSuccess, (state, { productId }) => ({
    ...state,
    items: state.items.filter(
      (item) => !item.products.some((product) => product.id === productId)
    ),
    loading: false,
    lastUpdated: new Date(),
  })),

  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Cart Item Quantity
  on(CartActions.updateCartItemQuantity, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    CartActions.updateCartItemQuantitySuccess,
    (state, { cartId, productId, quantity }) => ({
      ...state,
      items: state.items.map((item) => {
        const productIndex = item.products.findIndex((p) => p.id === productId);
        if (productIndex >= 0) {
          const updatedProducts = [...item.products];
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity,
          };
          return { ...item, products: updatedProducts };
        }
        return item;
      }),
      loading: false,
      lastUpdated: new Date(),
    })
  ),

  on(CartActions.updateCartItemQuantityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Cart
  on(CartActions.clearCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    items: [],
    loading: false,
    lastUpdated: new Date(),
  })),

  on(CartActions.clearCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export function reducer(state: CartState | undefined, action: any) {
  return cartReducer(state, action);
}
