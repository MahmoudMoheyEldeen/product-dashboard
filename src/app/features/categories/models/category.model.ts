export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  children?: Category[];
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
}

export const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null
};
