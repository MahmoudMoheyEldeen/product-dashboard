import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import * as FavoritesActions from '../actions/favorites.actions';
import { selectFavorites } from '../reducers/selectors';

@Injectable()
export class FavoritesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  // In a real app, you would make an HTTP request to save/load favorites
  // For now, we'll just use localStorage
  
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(() => {
        try {
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          return of(FavoritesActions.loadFavoritesSuccess({ items: favorites }));
        } catch (error) {
          return of(FavoritesActions.loadFavoritesFailure({ error: 'Failed to load favorites' }));
        }
      })
    )
  );

  saveFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          FavoritesActions.addToFavorites,
          FavoritesActions.removeFromFavorites
        ),
        withLatestFrom(this.store.select(selectFavorites)),
        map(([_, favorites]) => {
          localStorage.setItem('favorites', JSON.stringify(favorites));
        })
      ),
    { dispatch: false }
  );
}

export const favoritesEffects = [FavoritesEffects];
