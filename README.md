# Advanced Product Management Dashboard

![Angular](https://img.shields.io/badge/Angular-17.3.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8)
![NgRx](https://img.shields.io/badge/NgRx-17.x-purple)
![PrimeNG](https://img.shields.io/badge/PrimeNG-17.x-orange)
![i18n](https://img.shields.io/badge/i18n-Multi--language-green)

A responsive, multi-language web application for product management built with Angular 17+ and TypeScript, featuring a modern UI with TailwindCSS and PrimeNG components.

## 🌟 Features

### Core Features

- **Product Listing & Management**
  - Display products in a responsive grid/carousel
  - Product filtering and search functionality
  - Detailed product views with ratings and pricing
  - Pagination and infinite scroll options

- **Multi-language Support**
  - Full RTL support for Arabic language
  - Language switcher in the header
  - All UI elements, buttons, and messages are translatable

- **Shopping Cart & Wishlist**
  - Add/remove products to cart
  - Persistent cart storage
  - Wishlist functionality

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Smooth transitions and animations

### Technical Implementation

- **State Management**
  - NgRx store for global state management
  - Actions, Reducers, Selectors, and Effects
  - Optimized performance with memoized selectors

- **API Integration**
  - RESTful API consumption
  - Error handling and loading states
  - Fake Store API integration

- **Modern Angular Features**
  - Standalone components
  - Signal-based reactivity
  - Lazy loading modules
  - Angular 17+ features

- **Performance Optimizations**
  - Virtual scrolling for large lists
  - Lazy loading images
  - OnPush change detection strategy

## 🛠️ Technologies Used

- **Frontend Framework**
  - Angular 17+
  - TypeScript 5+

- **State Management**
  - NgRx Store
  - NgRx Effects
  - NgRx Entity

- **UI Components & Styling**
  - TailwindCSS for utility-first styling
  - PrimeNG for advanced UI components
  - Custom animations and transitions

- **Internationalization**
  - NGX-Translate for i18n support
  - RTL layout support
  - Language detection

- **Testing**
  - Jasmine and Karma for unit tests
  - Component testing
  - State testing

- **Build & Development**
  - Angular CLI
  - Webpack optimization
  - Environment configuration

## 📱 Application Structure

```
src/
├── app/
│   ├── core/            # Core functionality, guards, interceptors
│   ├── features/        # Feature modules (products, cart, etc.)
│   │   ├── products/    # Product-related components and services
│   │   ├── cart/        # Shopping cart functionality
│   │   └── ...          # Other feature modules
│   ├── pages/           # Page components
│   └── shared/          # Shared components, directives, and pipes
├── assets/
│   ├── i18n/            # Translation files
│   └── images/          # Static images
└── styles/              # Global styles and theme configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/product-dashboard.git

# Navigate to the project directory
cd product-dashboard

# Install dependencies
npm install

# Start the development server
npm start
```

Navigate to `http://localhost:4200/` to see the application running.

## 🌐 API Integration

This project uses the Fake Store API for product data. The API endpoints include:

- Products list: `GET /products`
- Product details: `GET /products/{id}`
- Categories: `GET /products/categories`
- Products by category: `GET /products/category/{name}`

## 🔧 Configuration

Environment configuration files are located in the `src/environments/` directory:

- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

## 📚 Additional Commands

```bash
# Build the project
npm run build

# Run unit tests
npm test

# Lint the code
npm run lint

# Generate production build
npm run build:prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

