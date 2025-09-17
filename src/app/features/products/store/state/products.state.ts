import { Product, ProductFilters } from '../../models/product.model';

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  filters: ProductFilters | null;
  total: number;
  page: number;
  limit: number;
}

export const initialProductsState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  filters: null,
  total: 0,
  page: 1,
  limit: 10,
};
