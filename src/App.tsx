import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import MainPage from '@pages/MainPage';
import AboutPage from '@pages/AboutPage';
import NotFoundPage from '@pages/NotFoundPage';
import Navbar from '@components/Navbar';
import SelectedItemsFlyout from '@components/SelectedItemsFlyout';
import { useTheme } from '@hooks/useTheme';
import { PokemonService } from '@services/PokemonService';
import { usePokemonData } from '@hooks/usePokemonData';
import { useSearchTerm } from '@hooks/useSearchTerm';

const POKEMON_CONFIG = {
  pageSize: 12,
  totalPokemons: 1302,
};

const App = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const { searchTerm } = useSearchTerm();

  const pokemonService = useMemo(() => new PokemonService(POKEMON_CONFIG), []);
  const { pokemons, loading, error, loadDefaultList, searchByName } =
    usePokemonData({ service: pokemonService });

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  useEffect(() => {
    if (shouldThrow) throw new Error('error Test');
  }, [shouldThrow]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      searchByName(searchTerm);
    } else {
      loadDefaultList(currentPage);
    }
  }, [currentPage, searchTerm, searchByName, loadDefaultList]);

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
              totalPages={pokemonService.getTotalPages()}
              onSearch={searchByName}
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

export default App;
