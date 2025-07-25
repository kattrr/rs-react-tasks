import { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import {
  fetchPokemonByName,
  fetchPokemonList,
  type PokemonDetails,
} from './api/pokeapi';
import { useLocalStorage } from './hooks/useLocalStorage';


const PAGE_SIZE = 12;
const TOTAL_POKEMONS = 1302;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMONS / PAGE_SIZE);

const App = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm] = useLocalStorage('searchTerm', '');
  const [shouldThrow, setShouldThrow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  useEffect(() => {
    if (shouldThrow) throw new Error('Prueba de error');
  }, [shouldThrow]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleSearch(searchTerm);
    } else {
      loadDefaultList(currentPage);
    }
  }, [currentPage]);

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
      setError('Error al cargar los Pokémon por defecto');
    }
  };

  const handleSearch = async (term: string) => {
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
      setError(`No se encontró ningún Pokémon llamado "${term}"`);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <>
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
    </>
  );
};

export default App;
