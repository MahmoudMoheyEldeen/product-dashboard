import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'https://fakestoreapi.com/products/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      map(categoryNames => {
        return categoryNames.map((name, index) => ({
          id: index + 1,
          name: this.formatCategoryName(name),
          slug: name,
          description: this.getCategoryDescription(name)
        }));
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  private formatCategoryName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/'S/g, "'s"); // Fix possessive form
  }

  private getCategoryDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      electronics: 'Electronic devices and accessories',
      "men's clothing": 'Fashion and apparel for men',
      "women's clothing": 'Fashion and apparel for women',
      jewelery: 'Jewelry and accessories'
    };
    return descriptions[name] || 'Browse our collection of ' + name;
  }

  getCategoryById(id: number): Observable<Category | null> {
    return this.getCategories().pipe(
      map(categories => categories.find(cat => cat.id === id) || null)
    );
  }

  getSubcategories(parentId: number): Observable<Category[]> {
    // In a real app, this would be an API call to get subcategories
    const mockSubcategories: Record<number, Category[]> = {
      1: [
        { id: 11, name: 'Smartphones', slug: 'smartphones', parentId: 1 },
        { id: 12, name: 'Laptops', slug: 'laptops', parentId: 1 },
        { id: 13, name: 'TVs', slug: 'tvs', parentId: 1 },
      ],
      2: [
        { id: 21, name: 'Men\'s Clothing', slug: 'mens-clothing', parentId: 2 },
        { id: 22, name: 'Women\'s Clothing', slug: 'womens-clothing', parentId: 2 },
        { id: 23, name: 'Kids\'s Clothing', slug: 'kids-clothing', parentId: 2 },
      ]
    };

    return of(mockSubcategories[parentId] || []);
  }
}
