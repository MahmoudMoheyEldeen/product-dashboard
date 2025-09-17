import { Product } from '../../products/models/product.model';

export interface CartProduct extends Omit<Product, 'rating'> {
  quantity: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  date: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface CartItem {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
