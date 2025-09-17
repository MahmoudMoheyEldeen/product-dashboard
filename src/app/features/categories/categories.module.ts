import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';

import { CategoriesComponent } from './components/categories/categories.component';
import { CategoriesService } from './services/categories.service';
import { categoriesReducer } from './store/reducers/categories.reducer';
import { CategoriesEffects } from './store/effects/categories.effects';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('categories', categoriesReducer),
    EffectsModule.forFeature([CategoriesEffects]),
    CategoriesComponent
  ],
  providers: [CategoriesService]
})
export class CategoriesModule { }
