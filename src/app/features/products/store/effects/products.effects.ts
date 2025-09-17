import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, delay, retryWhen, tap } from 'rxjs/operators';
import * as ProductsActions from '../actions/products.actions';
import { ProductsService } from '../../services/products.service';
import { Store } from '@ngrx/store';
import { selectFullProductsState } from '../reducers/selectors';
import { ProductsState } from '../state/products.state';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private store: Store<{ products: ProductsState }>
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      withLatestFrom(this.store.select(selectFullProductsState)),
      switchMap(([action, _]) =>
        this.productsService.getProducts({
          page: action.page,
          limit: action.limit,
          ...(action.filters || {}),
        }).pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000),
              tap(error => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map((response: any) =>
            ProductsActions.loadProductsSuccess({
              products: response.products || [],
              total: response.total || 0,
              page: response.page || 1,
              limit: response.limit || 10,
            })
          ),
          catchError((error: any) =>
            of(ProductsActions.loadProductsFailure({ error: error.message || 'An error occurred' }))
          )
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      switchMap((action) =>
        this.productsService.getProductById(action.id).pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000),
              tap(error => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map((product: any) =>
            ProductsActions.loadProductSuccess({ product })
          ),
          catchError((error: any) =>
            of(ProductsActions.loadProductFailure({ error: error.message || 'Failed to load product' }))
          )
        )
      )
    )
  );

  updateFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateFilters, ProductsActions.resetFilters),
      withLatestFrom(this.store.select(selectFullProductsState)),
      map(([_, state]) =>
        ProductsActions.loadProducts({
          page: 1, // Reset to first page when filters change
          limit: state.limit || 10,
          filters: state.filters || undefined,
        })
      )
    )
  );
}
