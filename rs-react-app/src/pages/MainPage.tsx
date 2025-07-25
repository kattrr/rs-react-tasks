import { SearchBar, CardList, Spinner } from '../components';
import Pagination from '../components/Pagination';

interface MainPageProps {
  pokemons: any[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
  onThrowError: () => void;
}

const MainPage = ({
  pokemons,
  loading,
  error,
  searchTerm,
  currentPage,
  totalPages,
  onSearch,
  onPageChange,
  onThrowError,
}: MainPageProps) => (
  <div className="mx-auto max-w-screen-lg">
    <h1 className="text-4xl font-bold mb-4 leading-tight">
      🔍 Pokémon Search
    </h1>
    <SearchBar onSearch={onSearch} />
    {loading && <Spinner />}
    {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    {!loading && !error && pokemons.length > 0 && (
      <>
        <CardList pokemons={pokemons} />
        {searchTerm.trim() === '' && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </>
    )}
    <button
      onClick={onThrowError}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 outline-none border border-transparent hover:outline-red-400 hover:border-red-400 focus:outline-4 focus:outline-blue-400 transition-colors text-base font-medium"
    >
      Throw error
    </button>
  </div>
);

export default MainPage; 