import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import SelectedItemsFlyout from './components/SelectedItemsFlyout';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/useTheme';
import {
  fetchPokemonByName,
  fetchPokemonList,
  type PokemonDetails,
} from './api/pokeapi';
import { useLocalStorage } from './hooks/useLocalStorage';

const PAGE_SIZE = 12;
const TOTAL_POKEMONS = 1302;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMONS / PAGE_SIZE);

const AppContent = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm] = useLocalStorage('searchTerm', '');
  const [shouldThrow, setShouldThrow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const loadDefaultList = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const list = await fetchPokemonList(offset, PAGE_SIZE);
      const detailed = await Promise.all(
        list.map((p) => fetchPokemonByName(p.name))
      );
      setPokemons(detailed);
      setLoading(false);
    } catch {
      setLoading(false);
      setError('Error loading default Pokémon');
    }
  };

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term) {
        loadDefaultList(currentPage);
        return;
      }
      setLoading(true);
      setError(null);
      setPokemons([]);
      try {
        const pokemon = await fetchPokemonByName(term.toLowerCase());
        setPokemons([pokemon]);
        setLoading(false);
      } catch {
        setError(`No Pokémon found named "${term}"`);
        setLoading(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    if (shouldThrow) throw new Error('error Test');
  }, [shouldThrow]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleSearch(searchTerm);
    } else {
      loadDefaultList(currentPage);
    }
  }, [currentPage, searchTerm, handleSearch]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}
    >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              pokemons={pokemons}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onSearch={handleSearch}
              onPageChange={handlePageChange}
              onThrowError={() => setShouldThrow(true)}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SelectedItemsFlyout />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
