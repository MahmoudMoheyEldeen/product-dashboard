import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductsResponse, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products'; // FakeStore API endpoint

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    page?: number;
    limit?: number;
    filters?: ProductFilters;
    category?: string | null;
    searchQuery?: string;
    sortField?: 'price' | 'rating' | 'none';
    sortDirection?: 'asc' | 'desc' | 'none';
  }): Observable<ProductsResponse> {
    console.log('Fetching products with params:', params);
    
    const { page = 1, limit = 8, filters, category } = params || {};
    
    // If we have a category, use the category-specific endpoint
    const endpoint = category 
      ? `${this.apiUrl}/category/${encodeURIComponent(category)}`
      : this.apiUrl;
    
    return this.http.get<Product[]>(endpoint).pipe(
      map(products => {
        let filteredProducts = [...products];
        
        // Apply search query if provided
        if (params?.searchQuery) {
          const searchTerm = params.searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
          );
        }
        
        // Apply additional filters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'category') {
              filteredProducts = filteredProducts.filter(product => 
                String(product[key as keyof Product]).toLowerCase().includes(String(value).toLowerCase())
              );
            }
          });
        }
        
        // Apply sorting if requested
        if (params?.sortField && params.sortField !== 'none' && params.sortDirection && params.sortDirection !== 'none') {
          filteredProducts.sort((a, b) => {
            let valueA: number;
            let valueB: number;
            
            if (params.sortField === 'price') {
              valueA = a.price;
              valueB = b.price;
            } else if (params.sortField === 'rating' && a.rating && b.rating) {
              valueA = a.rating.rate;
              valueB = b.rating.rate;
            } else {
              return 0;
            }
            
            const sortOrder = params.sortDirection === 'asc' ? 1 : -1;
            if (valueA < valueB) return -1 * sortOrder;
            if (valueA > valueB) return 1 * sortOrder;
            return 0;
          });
        }
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
        
        return {
          products: paginatedProducts,
          total: filteredProducts.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(filteredProducts.length / limit)
        };
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of({
          products: [],
          total: 0,
          page: page || 1,
          limit: limit || 10,
          totalPages: 0,
        });
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    console.log('Fetching product with ID:', id);
    
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      })
    );
  }

  private createParams(params: any): { [param: string]: string } {
    const result: { [key: string]: string } = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        result[key] = String(value);
      }
    });
    
    return result;
  }
}
