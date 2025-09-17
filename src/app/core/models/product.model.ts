export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  image?: string;
  rating?: number;
  category?: string;
  inStock?: boolean;
  stock?: number;
  brand?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}
