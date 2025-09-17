import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  delay,
  retryWhen,
  tap,
} from 'rxjs/operators';
import * as CartActions from '../actions/cart.actions';
import { CartService } from '../../services/cart.service';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private cartService: CartService) {}

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartService.getCart().pipe(
          retryWhen((errors) =>
            errors.pipe(
              delay(1000),
              tap((error) => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map((items) => CartActions.loadCartSuccess({ items })),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      switchMap(({ product, quantity }) =>
        this.cartService.addToCart(product, quantity).pipe(
          retryWhen((errors) =>
            errors.pipe(
              delay(1000),
              tap((error) => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map((item) => CartActions.addToCartSuccess({ item })),
          catchError((error) =>
            of(CartActions.addToCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      switchMap(({ productId }) =>
        this.cartService.removeFromCart(productId).pipe(
          retryWhen((errors) =>
            errors.pipe(
              delay(1000),
              tap((error) => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map(() => CartActions.removeFromCartSuccess({ productId })),
          catchError((error) =>
            of(CartActions.removeFromCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateCartItemQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItemQuantity),
      switchMap(({ cartId, productId, quantity }) =>
        this.cartService
          .updateCartItemQuantity(cartId, productId, quantity)
          .pipe(
            retryWhen((errors) =>
              errors.pipe(
                delay(1000),
                tap((error) => {
                  if (error.status >= 500) {
                    throw error;
                  }
                })
              )
            ),
            map(() =>
              CartActions.updateCartItemQuantitySuccess({
                cartId,
                productId,
                quantity,
              })
            ),
            catchError((error) =>
              of(
                CartActions.updateCartItemQuantityFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      switchMap(() =>
        this.cartService.clearCart().pipe(
          retryWhen((errors) =>
            errors.pipe(
              delay(1000),
              tap((error) => {
                if (error.status >= 500) {
                  throw error;
                }
              })
            )
          ),
          map(() => CartActions.clearCartSuccess()),
          catchError((error) =>
            of(CartActions.clearCartFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
