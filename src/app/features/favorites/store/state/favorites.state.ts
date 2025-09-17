import { Product } from '../../../../features/products/models/product.model';

export interface FavoritesState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null
};
