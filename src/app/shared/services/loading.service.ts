import { Injectable, computed, signal } from '@angular/core';

type LoadingState = {
  [key: string]: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingState = signal<LoadingState>({});

  // Computed property to check if any loading state is true
  isLoading = computed(() => {
    return Object.values(this.loadingState()).some(state => state);
  });

  // Set loading state for a specific key
  setLoading(key: string, isLoading: boolean): void {
    this.loadingState.update(state => ({
      ...state,
      [key]: isLoading,
    }));
  }

  // Get loading state for a specific key
  getLoading(key: string): boolean {
    return this.loadingState()[key] || false;
  }

  // Reset all loading states
  resetAll(): void {
    this.loadingState.set({});
  }
}
