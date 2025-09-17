import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';

import { FavoritesComponent } from './components/favorites/favorites.component';
import { favoritesReducer } from './store/reducers/favorites.reducer';
import { FavoritesEffects } from './store/effects/favorites.effects';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('favorites', favoritesReducer),
    EffectsModule.forFeature([FavoritesEffects]),
    FavoritesComponent
  ],
  providers: []
})
export class FavoritesModule { }
