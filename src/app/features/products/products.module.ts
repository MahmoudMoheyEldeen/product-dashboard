import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { ProductsEffects } from './store/effects/products.effects';
import { productsReducer } from './store/reducers/products.reducer';
import { ProductsService } from './services/products.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('products', productsReducer),
    EffectsModule.forFeature([ProductsEffects]),
  ],
  providers: [ProductsService],
  exports: [],
})
export class ProductsModule {}
