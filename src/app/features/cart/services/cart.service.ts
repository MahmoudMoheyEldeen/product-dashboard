import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import {
  CartItem,
  CartProduct,
  CartResponse,
  CartState,
} from '../models/cart.model';
import { Product } from '../../products/models/product.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://fakestoreapi.com/carts';
  private cartState = new BehaviorSubject<CartState>({
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  cartState$ = this.cartState.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number = 1): Observable<CartItem[]> {
    this.updateState({ loading: true, error: null });

    return this.http.get<CartResponse[]>(`${this.apiUrl}/user/${userId}`).pipe(
      switchMap((carts: CartResponse[]) => {
        if (carts.length === 0) {
          this.updateState({
            items: [],
            loading: false,
            lastUpdated: new Date(),
          });
          return of([]);
        }

        // Get product details for each product in the cart
        const productIds = carts.flatMap((cart) =>
          cart.products.map((product) => product.productId)
        );

        // For demo purposes, we'll fetch all products and filter them
        return this.http
          .get<Product[]>('https://fakestoreapi.com/products')
          .pipe(
            map((products) => {
              // Transform the API response to match our CartItem interface
              const cartItems: CartItem[] = carts.map((cart) => ({
                id: cart.id,
                userId: cart.userId,
                date: cart.date,
                products: cart.products.map((item) => {
                  const productDetails = products.find(
                    (p) => p.id === item.productId
                  );
                  return {
                    id: item.productId,
                    quantity: item.quantity,
                    title: productDetails?.title || 'Product not found',
                    price: productDetails?.price || 0,
                    description: productDetails?.description || '',
                    category: productDetails?.category || '',
                    image: productDetails?.image || '',
                  };
                }),
              }));

              this.updateState({
                items: cartItems,
                loading: false,
                lastUpdated: new Date(),
              });

              return cartItems;
            })
          );
      }),
      catchError((error) => {
        console.error('Error fetching cart:', error);
        this.updateState({
          loading: false,
          error: 'Failed to load cart. Please try again later.',
        });
        return of([]);
      })
    );
  }

  private updateState(partialState: Partial<CartState>): void {
    this.cartState.next({
      ...this.cartState.value,
      ...partialState,
    });
  }

  addToCart(product: Product, userId: number = 1): Observable<CartItem> {
    const payload = {
      userId: userId,
      date: new Date().toISOString(),
      products: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    };

    return this.http.post<CartResponse>(this.apiUrl, payload).pipe(
      // Transform CartResponse to CartItem
      map((response) => {
        // Create a CartItem with CartProduct objects that have all required properties
        const cartItem: CartItem = {
          id: response.id,
          userId: response.userId,
          date: response.date,
          products: response.products.map((p) => ({
            id: p.productId,
            quantity: p.quantity,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
          })),
        };
        return cartItem;
      }),
      tap(() => {
        Swal.fire({
          title: 'نجاح',
          text: 'تم إضافة المنتج بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#3b82f6',
        });
        // Refresh the cart after adding an item
        this.getCart(userId).subscribe();
      }),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ أثناء إضافة المنتج إلى السلة',
          icon: 'error',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#ef4444',
        });
        throw error;
      })
    );
  }

  removeFromCart(productId: number, userId: number = 1): Observable<void> {
    // First, find the cart that contains this product
    return this.getCart(userId).pipe(
      switchMap((carts) => {
        // Find the cart that contains the product
        const cart = carts.find((c) =>
          c.products.some((p) => p.id === productId)
        );

        if (!cart) {
          throw new Error('Product not found in any cart');
        }

        // In a real API, you would call a specific endpoint to remove a product from a cart
        // For FakeStoreAPI, we'll simulate by deleting the cart and showing a success message
        return this.http.delete<void>(`${this.apiUrl}/${cart.id}`).pipe(
          tap(() => {
            // Refresh the cart after removing an item
            this.getCart(userId).subscribe();

            Swal.fire({
              title: 'تم الحذف',
              text: 'تم حذف المنتج من السلة',
              icon: 'success',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#3b82f6',
            });
          })
        );
      }),
      catchError((error) => {
        console.error('Error removing from cart:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ أثناء حذف المنتج من السلة',
          icon: 'error',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#ef4444',
        });
        throw error;
      })
    );
  }

  updateCartItemQuantity(
    cartId: number,
    productId: number,
    quantity: number,
    userId: number = 1
  ): Observable<CartResponse> {
    // In a real implementation, you would update the cart item quantity via API
    // For FakeStoreAPI, we need to get the cart, update the item, and then PUT the updated cart
    return this.http.get<CartResponse>(`${this.apiUrl}/${cartId}`).pipe(
      map((cart) => {
        // Update the quantity for the specified product
        const updatedProducts = cart.products.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );

        // Remove the item if quantity is 0 or less
        const filteredProducts = updatedProducts.filter(
          (item) => item.quantity > 0
        );

        return { ...cart, products: filteredProducts };
      }),
      switchMap((updatedCart) =>
        this.http.put<CartResponse>(`${this.apiUrl}/${cartId}`, updatedCart)
      ),
      tap(() => {
        // Refresh the cart after updating
        this.getCart(userId).subscribe();
      }),
      catchError((error) => {
        console.error('Error updating cart item quantity:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ أثناء تحديث كمية المنتج',
          icon: 'error',
          confirmButtonText: 'حسناً',
        });
        throw error;
      })
    );
  }

  clearCart(userId: number = 1): Observable<CartResponse> {
    // In a real implementation, you would clear the cart via API
    // For FakeStoreAPI, we'll create a new empty cart
    const emptyCart = {
      userId: userId,
      date: new Date().toISOString(),
      products: [],
    };

    return this.http.post<CartResponse>(this.apiUrl, emptyCart).pipe(
      tap(() => {
        // Update the local state
        this.updateState({
          items: [],
          lastUpdated: new Date(),
        });

        Swal.fire({
          title: 'تم',
          text: 'تم تفريغ السلة بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً',
        });
      }),
      catchError((error) => {
        console.error('Error clearing cart:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ أثناء تفريغ السلة',
          icon: 'error',
          confirmButtonText: 'حسناً',
        });
        throw error;
      })
    );
  }

  // Helper method to calculate cart total
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, cart) => {
      const cartTotal = cart.products.reduce((cartSum, product) => {
        return cartSum + product.price * product.quantity;
      }, 0);
      return total + cartTotal;
    }, 0);
  }
}
