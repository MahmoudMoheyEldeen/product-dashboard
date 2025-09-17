import { CartItem } from '../../models/cart.model';

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const initialCartState: CartState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};
