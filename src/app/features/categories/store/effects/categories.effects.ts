import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CategoriesService } from '../../services/categories.service';
import * as CategoriesActions from '../actions/categories.actions';
import { AppState } from '../../../../app.state';
import { selectAllCategories } from '../reducers/selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private categoriesService: CategoriesService
  ) {}

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.loadCategories),
      withLatestFrom(this.store.select(selectAllCategories)),
      switchMap(([_, categories]) => {
        if (categories.length > 0) {
          // If we already have categories in the store, don't fetch them again
          return of(CategoriesActions.loadCategoriesSuccess({ categories }));
        }
        
        return this.categoriesService.getCategories().pipe(
          map(categories => CategoriesActions.loadCategoriesSuccess({ categories })),
          catchError(error => of(CategoriesActions.loadCategoriesFailure({ 
            error: 'Failed to load categories' 
          })))
        );
      })
    )
  );

  selectCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.selectCategory),
      withLatestFrom(this.store.select(selectAllCategories)),
      switchMap(([{ categoryId }, categories]) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
          return of(CategoriesActions.selectCategorySuccess({ category }));
        } else {
          return of(CategoriesActions.loadCategoriesFailure({ 
            error: 'Category not found' 
          }));
        }
      })
    )
  );
}

export const categoriesEffects = [CategoriesEffects];
