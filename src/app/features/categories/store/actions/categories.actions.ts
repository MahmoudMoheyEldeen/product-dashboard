import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/category.model';

export const loadCategories = createAction('[Categories] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);

export const selectCategory = createAction(
  '[Categories] Select Category',
  props<{ categoryId: number }>()
);

export const selectCategorySuccess = createAction(
  '[Categories] Select Category Success',
  props<{ category: Category }>()
);

export const clearSelectedCategory = createAction('[Categories] Clear Selected Category');
