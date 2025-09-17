import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ProgressSpinnerModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  expandedCategories: Set<number> = new Set();

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoriesService.getCategories().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories. Please try again later.';
        return of([]);
      })
    ).subscribe(categories => {
      this.categories = categories;
      this.loading = false;
    });
  }

  toggleCategory(categoryId: number): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId);
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Electronics': 'pi-mobile',
      'Jewelery': 'pi-gem',
      "Men's Clothing": 'pi-male',
      "Women's Clothing": 'pi-female'
    };
    return iconMap[categoryName] || 'pi-tag';
  }
}
