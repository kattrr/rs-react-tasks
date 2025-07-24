# Pokémon Search App

A simple React + TypeScript application to search and display Pokémon information using the [PokéAPI](https://pokeapi.co/). Built with Vite for fast development and modern tooling.

## Features

- **Search Pokémon by name**: Enter a Pokémon name to fetch and display its details (name, type, image).
- **Default Pokémon list**: Shows a default set of Pokémon on first load.
- **Persistent search**: Remembers your last search using localStorage.
- **Loading indicator**: Displays a spinner while fetching data.
- **Error handling**: User-friendly error messages and an error boundary for unexpected issues.
- **Component-based architecture**: Clean separation of UI and logic.
- **Unit tests**: Includes tests for main components and API logic using Vitest and Testing Library.

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

## Project Structure

- `src/` - Main source code
  - `components/` - React components (Card, CardList, SearchBar, Spinner, ErrorBoundary)
  - `api/` - API logic for fetching Pokémon data
  - `_test_/` - Unit tests
- `public/` - Static assets

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [PokéAPI](https://pokeapi.co/)
- [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/)
- [Tailwind CSS](https://tailwindcss.com/) (for styling)

## License

This project is licensed under the MIT License.
