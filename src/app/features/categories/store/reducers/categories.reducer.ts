import { createReducer, on } from '@ngrx/store';
import * as CategoriesActions from '../actions/categories.actions';
import { CategoriesState, initialState } from '../../models/category.model';

export const categoriesReducer = createReducer(
  initialState,
  on(CategoriesActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoriesActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
    error: null
  })),
  on(CategoriesActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CategoriesActions.selectCategorySuccess, (state, { category }) => ({
    ...state,
    selectedCategory: category
  })),
  on(CategoriesActions.clearSelectedCategory, (state) => ({
    ...state,
    selectedCategory: null
  }))
);

export const getCategories = (state: CategoriesState) => state.categories;
export const getCategoriesLoading = (state: CategoriesState) => state.loading;
export const getCategoriesError = (state: CategoriesState) => state.error;
export const getSelectedCategory = (state: CategoriesState) => state.selectedCategory;
