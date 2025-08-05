# Pokémon Search App

A React + TypeScript application to search and display Pokémon information using the [PokéAPI](https://pokeapi.co/). Built with Vite for fast development and modern tooling. Features state management with Zustand and theme support with Context API.

## Features

### Core Features

- **Search Pokémon by name**: Enter a Pokémon name to fetch and display its details (name, type, image).
- **Default Pokémon list**: Shows a default set of Pokémon on first load.
- **Persistent search**: Remembers your last search using localStorage.
- **Loading indicator**: Displays a spinner while fetching data.
- **Error handling**: User-friendly error messages and an error boundary for unexpected issues.
- **Component-based architecture**: Clean separation of UI and logic.
- **Unit tests**: Includes tests for main components and API logic using Vitest and Testing Library.

### State Management Features

- **Item Selection**: Checkboxes on each Pokémon card for selection
- **Selected Items Flyout**: Dynamic flyout that appears when items are selected
- **CSV Download**: Download selected Pokémon data as CSV files
- **Persistent State**: Selected items persist between navigation
- **Bulk Actions**: "Unselect all" functionality

### Theme Features

- **Light/Dark Mode**: Toggle between light and dark themes
- **Theme Selector**: Easy theme switching in the navbar
- **Persistent Theme**: Theme preference is saved
- **Smooth Transitions**: CSS transitions for theme changes

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd rs-react-app
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

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### Running Tests

To run unit tests:

```bash
npm run test
# or
yarn test
```

## How to Use

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

## Project Structure

```
src/
├── components/           # React components
│   ├── Card.tsx         # Pokémon card with checkbox
│   ├── CardList.tsx     # Grid of Pokémon cards
│   ├── SearchBar.tsx    # Search functionality
│   ├── Spinner.tsx      # Loading indicator
│   ├── ErrorBoundary.tsx # Error handling
│   ├── SelectedItemsFlyout.tsx # Selection flyout
│   ├── ThemeSelector.tsx # Theme switcher
│   └── _test_/          # Component tests
├── contexts/            # Context API
│   ├── ThemeContext.tsx # Theme management
│   └── _test_/          # Context tests
├── store/               # State management
│   ├── selectedItemsStore.ts # Zustand store
│   └── _test_/          # Store tests
├── api/                 # API logic
│   └── pokeapi.ts       # Pokémon API calls
├── pages/               # Page components
├── hooks/               # Custom hooks
└── _test_/              # Main tests
```

## Technologies Used

### Core Technologies

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

### State Management

- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [Context API](https://react.dev/reference/react/createContext) - Theme management

### Testing

- [Vitest](https://vitest.dev/) - Test runner
- [Testing Library](https://testing-library.com/) - Component testing

### APIs

- [PokéAPI](https://pokeapi.co/) - Pokémon data

## State Management Architecture

### Zustand Store

The application uses Zustand for managing selected Pokémon items:

```typescript
// Store features
-addItem(pokemon) - // Add Pokémon to selection
  removeItem(id) - // Remove Pokémon from selection
  clearAll() - // Clear all selections
  isSelected(id) - // Check if Pokémon is selected
  getSelectedCount(); // Get number of selected items
```

### Context API

Theme management is handled through React Context:

```typescript
// Theme context features
-theme - // Current theme (light/dark)
  toggleTheme() - // Switch between themes
  setTheme(theme); // Set specific theme
```

## Testing

The project includes comprehensive tests covering:

- ✅ **Context API**: Theme management functionality
- ✅ **Zustand Store**: State management operations
- ✅ **UI Components**: Card, ThemeSelector, and other components
- ✅ **Integration**: Theme integration and item selection
- ✅ **API Logic**: Pokémon data fetching

Run tests with:

```bash
npm test
```

## Development Branch

This implementation was developed on the `app-state-management` branch.

## License

This project is licensed under the MIT License.
