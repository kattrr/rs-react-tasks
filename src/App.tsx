import { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router';
import MainPage from '@pages/MainPage';
import AboutPage from '@pages/AboutPage';
import NotFoundPage from '@pages/NotFoundPage';
import Navbar from '@components/Navbar';
import SelectedItemsFlyout from '@components/SelectedItemsFlyout';
import { useTheme } from '@hooks/useTheme';
import { useSearchTerm } from '@hooks/useSearchTerm';
import {
  usePokemonList,
  usePokemonSearch,
  useInvalidatePokemonCache,
  getTotalPages,
} from '@hooks/usePokemonQueries';

const App = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const { searchTerm, updateSearchTerm, clearSearchTerm } = useSearchTerm();
  const [isInitialized, setIsInitialized] = useState(false);

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const urlSearchTerm = searchParams.get('search') || '';

  useEffect(() => {
    if (!isInitialized) {
      if (urlSearchTerm) {
        updateSearchTerm(urlSearchTerm);
      }
      setIsInitialized(true);
    }
  }, [urlSearchTerm, updateSearchTerm, isInitialized]);

  const pokemonListQuery = usePokemonList(currentPage);
  const pokemonSearchQuery = usePokemonSearch(searchTerm);
  const { invalidateAll } = useInvalidatePokemonCache();

  const isSearching = searchTerm.trim() !== '';
  const activeQuery = isSearching ? pokemonSearchQuery : pokemonListQuery;

  useEffect(() => {
    if (shouldThrow) throw new Error('error Test');
  }, [shouldThrow]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  const handleRefresh = () => {
    invalidateAll();
    clearSearchTerm();
    setSearchParams({ page: '1' });
  };

  const handleSearch = (term: string) => {
    const newParams = new URLSearchParams(searchParams);
    updateSearchTerm(term);

    if (term.trim() === '') {
      newParams.delete('search');
    } else {
      newParams.set('search', term);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
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
              pokemons={activeQuery.data || []}
              loading={activeQuery.isLoading}
              error={activeQuery.error?.message || null}
              searchTerm={searchTerm}
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
              onRefresh={handleRefresh}
              onSearch={handleSearch}
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

export default App;
