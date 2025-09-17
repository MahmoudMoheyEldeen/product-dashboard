import { Product } from '../features/products/models/product.model';

export interface AppState {
  products: {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
    filters: any;
  };
  // Add other feature states here
}
