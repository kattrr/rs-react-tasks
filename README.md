# Pokémon Search App

A modern React + TypeScript application built with **Next.js 15** to search and display Pokémon information using the [PokéAPI](https://pokeapi.co/). Features server-side rendering, internationalization, and modern React patterns with App Router.

## 🚀 Features

### Core Features

- **Search Pokémon by name**: Enter a Pokémon name to fetch and display its details (name, type, image, abilities, moves)
- **Server-side rendered Pokémon list**: Initial data is fetched on the server for better performance and SEO
- **Persistent search**: Remembers your last search using localStorage
- **Loading states**: Suspense boundaries and loading indicators while fetching data
- **Error handling**: Comprehensive error boundaries and user-friendly error messages
- **Responsive design**: Mobile-first approach with Tailwind CSS

### State Management Features

- **Item Selection**: Checkboxes on each Pokémon card for selection
- **Selected Items Flyout**: Dynamic flyout that appears when items are selected
- **CSV Export**: Download selected Pokémon data as CSV files using Next.js Server Actions
- **Persistent State**: Selected items persist between navigation using Zustand
- **Bulk Actions**: "Unselect all" functionality

### Internationalization (i18n)

- **Multi-language support**: English (en) and Spanish (es)
- **Locale-based routing**: `/en/` and `/es/` URL structure
- **Automatic locale detection**: Middleware handles locale routing
- **Translatable content**: All UI text supports multiple languages

### Theme Features

- **Light/Dark Mode**: Toggle between light and dark themes
- **Theme Selector**: Easy theme switching in the navbar
- **Persistent Theme**: Theme preference is saved in localStorage
- **Smooth Transitions**: CSS transitions for theme changes

## 🏗️ Architecture

### Next.js 15 App Router

- **App Router**: Modern file-based routing with `src/app/[locale]/`
- **Server Components**: Initial data fetching on the server
- **Client Components**: Interactive components marked with `'use client'`
- **Server Actions**: CSV export functionality using `'use server'`
- **Suspense**: Loading states and streaming

### Data Fetching

- **React Query (TanStack Query)**: Client-side data management
- **Server-side initial data**: First page load fetches data on server
- **Client-side caching**: Subsequent searches use React Query cache
- **Optimistic updates**: Smooth user experience with immediate feedback

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd rs-react-tasks
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### Navigation

- **Home**: `/en/` or `/es/` - Main Pokémon list
- **About**: `/en/about` or `/es/about` - Information page
- **Language switching**: Use the language selector in the navbar

### Selecting Pokémon

1. Click the checkboxes on Pokémon cards to select them
2. The flyout will appear automatically when items are selected
3. Use "Unselect all" to clear all selections

### Downloading Data

1. Select one or more Pokémon using the checkboxes
2. Click "Download" in the flyout to get a CSV file
3. The file will be named with the number of selected items (e.g., "3_items.csv")

### Changing Theme

1. Use the Light/Dark buttons in the navbar
2. The theme will apply immediately to the entire application
3. Your theme preference will be saved for future visits

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Home page (server component)
│   │   ├── about/         # About page
│   │   └── layout.tsx     # Root layout with providers
│   ├── actions/           # Server Actions
│   │   └── exportCSV.ts   # CSV export functionality
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Card.tsx          # Pokémon card with checkbox
│   ├── CardList.tsx      # Grid of Pokémon cards
│   ├── ClientMainPage.tsx # Client-side main page
│   ├── SearchBar.tsx     # Search functionality
│   ├── Spinner.tsx       # Loading indicator
│   ├── ErrorBoundary.tsx # Error handling
│   ├── SelectedItemsFlyout.tsx # Selection flyout
│   ├── ThemeSelector.tsx # Theme switcher
│   └── _test_/           # Component tests
├── contexts/             # Context API
│   └── ThemeContext.tsx  # Theme management
├── store/                # State management
│   └── selectedItemsStore.ts # Zustand store
├── api/                  # API logic
│   └── pokeapi.ts        # Pokémon API calls
├── hooks/                # Custom hooks
│   └── usePokemonQueries.ts # React Query hooks
├── providers/            # App providers
│   ├── QueryProvider.tsx # React Query provider
│   └── ThemeProvider.tsx # Theme context provider
├── services/             # Business logic
│   └── CSVExportService.ts # CSV generation
├── i18n/                 # Internationalization
│   ├── routing.ts        # Locale routing config
│   ├── navigation.ts     # Navigation translations
│   └── request.ts        # Request handling
├── middleware.ts         # Next.js middleware for i18n
└── _test_/               # Test setup and utilities
```

## 🧪 Testing

The project includes comprehensive tests covering:

- ✅ **Components**: All UI components with React Testing Library
- ✅ **Hooks**: Custom hooks with proper mocking
- ✅ **Store**: Zustand state management
- ✅ **API**: Pokémon data fetching logic
- ✅ **Context**: Theme management
- ✅ **Server Actions**: CSV export functionality

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

Current test coverage:

- **Statements**: 100%
- **Branches**: 66.66% (some edge cases in CardList)
- **Functions**: 50% (some utility functions)
- **Lines**: 100%

## 🚀 Technologies Used

### Core Framework

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library with latest features
- [TypeScript 5.8](https://www.typescriptlang.org/) - Type safety

### Styling & UI

- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge) - Class merging utility

### State Management

- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [React Context](https://react.dev/reference/react/createContext) - Theme management

### Data Fetching

- [React Query (TanStack Query)](https://tanstack.com/query) - Server state management
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) - Server-side mutations

### Internationalization

- [next-intl](https://next-intl-docs.vercel.app/) - i18n for Next.js
- [next-intl/middleware](https://next-intl-docs.vercel.app/docs/routing/middleware) - Locale routing

### Testing

- [Vitest](https://vitest.dev/) - Fast test runner
- [React Testing Library](https://testing-library.com/) - Component testing
- [jsdom](https://github.com/jsdom/jsdom) - DOM environment for tests

### Development Tools

- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [lint-staged](https://github.com/okonet/lint-staged) - Pre-commit linting

## 🔄 Migration from Vite

This project was originally built with Vite and has been successfully migrated to Next.js 15:

### Key Changes

- **Build System**: Vite → Next.js with Turbopack
- **Routing**: Client-side routing → App Router with file-based routing
- **Data Fetching**: Client-only → Server-side rendering + React Query
- **Internationalization**: Manual setup → next-intl with middleware
- **Testing**: Vite test runner → Vitest (maintained for compatibility)

### Benefits of Migration

- **Better SEO**: Server-side rendering for initial content
- **Performance**: Automatic code splitting and optimization
- **Developer Experience**: Built-in routing, middleware, and optimizations
- **Production Ready**: Optimized builds and deployment options

## 📊 Performance Features

- **Server-side rendering**: Initial page load with data
- **Automatic code splitting**: Route-based code splitting
- **Image optimization**: Next.js Image component with remote patterns
- **Static generation**: Optimized builds for production
- **Caching**: React Query for client-side data caching

## 🌐 Deployment

The app is configured for static export and can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- Any static hosting service

### Build Configuration

```javascript
// next.config.mjs
{
  distDir: './dist',        // Custom build output
  trailingSlash: true,      // Static export compatibility
  images: {
    unoptimized: true,      // Required for static export
  }
}
```

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [API Documentation](https://pokeapi.co/docs/v2)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
