import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home - Product Dashboard',
    data: { breadcrumb: 'HOME' }
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/components/products/products.component').then(m => m.ProductsComponent),
    title: 'Products - Product Dashboard',
    data: { breadcrumb: 'PRODUCTS' }
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/components/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'Categories - Product Dashboard',
    data: { breadcrumb: 'CATEGORIES' }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/components/favorites/favorites.component').then(m => m.FavoritesComponent),
    title: 'Favorites - Product Dashboard',
    data: { breadcrumb: 'FAVORITES' }
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/components/cart/cart.component').then(m => m.CartComponent),
    title: 'Shopping Cart - Product Dashboard',
    data: { breadcrumb: 'CART' }
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
