import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from '../../../../features/products/models/product.model';
import { AppState } from '../../../../core/state/app.state';
import * as FavoritesActions from '../../store/actions/favorites.actions';
import {
  selectFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
} from '../../store/reducers/selectors';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.favorites$ = this.store.select(selectFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
    this.error$ = this.store.select(selectFavoritesError);
  }

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  removeFromFavorites(productId: number): void {
    this.store.dispatch(FavoritesActions.removeFromFavorites({ productId }));
  }
}
