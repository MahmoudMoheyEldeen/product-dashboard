import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from '../../models/category.model';

export const selectCategoriesState = createFeatureSelector<CategoriesState>('categories');

export const selectAllCategories = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.categories
);

export const selectMainCategories = createSelector(
  selectAllCategories,
  (categories) => categories.filter(category => !category.parentId)
);

export const selectSubcategories = (parentId: number) => createSelector(
  selectAllCategories,
  (categories) => categories.filter(category => category.parentId === parentId)
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.error
);

export const selectCurrentCategory = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.selectedCategory
);

export const selectCategoryById = (categoryId: number) => createSelector(
  selectAllCategories,
  (categories) => categories.find(category => category.id === categoryId)
);
