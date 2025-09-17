import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';

import { routes } from './app.routes';
import { productsReducer } from './features/products/store/reducers/products.reducer';
import { ProductsEffects } from './features/products/store/effects/products.effects';
import { cartReducer } from './features/cart/store/reducers/cart.reducer';
import { CartEffects } from './features/cart/store/effects/cart.effects';
import { favoritesReducer } from './features/favorites/store/reducers';
import { FavoritesEffects } from './features/favorites/store/effects/favorites.effects';
import { categoriesReducer } from './features/categories/store/reducers';
import { CategoriesEffects } from './features/categories/store/effects/categories.effects';
import { routerReducer } from '@ngrx/router-store';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideAnimations(),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    
    // NgRx Store Configuration
    provideStore({
      products: productsReducer,
      cart: cartReducer,
      favorites: favoritesReducer,
      categories: categoriesReducer,
      router: routerReducer
    }),
    
    // NgRx Effects
    provideEffects([
      ProductsEffects, 
      CartEffects, 
      FavoritesEffects, 
      CategoriesEffects
    ]),
    
    // NgRx Router Store
    provideRouterStore(),
    
    // NgRx DevTools
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
