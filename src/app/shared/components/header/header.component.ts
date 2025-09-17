import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.state';

// Ngx-Translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Selectors
import { selectFavoritesCount } from '../../../features/favorites/store/reducers/selectors';
import { selectCartTotalItems } from '../../../features/cart/store/selectors/cart.selectors';

interface Language {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DropdownModule,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  currentLanguage: string = 'en';
  cartItemsCount$: Observable<number>;
  favoritesCount$: Observable<number>;
  isMenuOpen = false;

  languages: Language[] = [
    { name: 'English', code: 'en', flag: 'assets/images/flags/18166.jpg' },
    { name: 'العربية', code: 'ar', flag: 'assets/images/flags/27140.jpg' },
  ];

  selectedLanguage: Language = this.languages[0];

  constructor(
    public translate: TranslateService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.cartItemsCount$ = this.store.select(selectCartTotalItems);
    this.favoritesCount$ = this.store.select(selectFavoritesCount);
    // Set the default language
    this.translate.setDefaultLang('en');
    this.currentLanguage = this.translate.currentLang || 'en';
  }

  ngOnInit() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang) {
      const lang = this.languages.find((l) => l.code === savedLang);
      if (lang) {
        this.changeLanguage(lang);
      }
    }
  }

  onSearch() {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  changeLanguage(language: Language) {
    this.selectedLanguage = language;
    this.translate.use(language.code);
    localStorage.setItem('userLanguage', language.code);
    // Add RTL support for Arabic
    document.documentElement.dir = language.code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }
}
