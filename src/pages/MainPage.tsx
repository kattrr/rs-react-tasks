import { SearchBar, CardList, Spinner } from '@components';
import Pagination from '@components/Pagination';
import { useSearchParams } from 'react-router';
import PokemonDetailsPanel from '@components/PokemonDetailsPanel';
import type { PokemonDetails } from '@api/pokeapi';

interface MainPageProps {
  pokemons: PokemonDetails[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onSearch: (term: string) => void;
  onThrowError: () => void;
}

const MainPage = ({
  pokemons,
  loading,
  error,
  searchTerm,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
  onSearch,
  onThrowError,
}: MainPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsName = searchParams.get('details');

  const handleCardClick = (name: string) => {
    setSearchParams({
      page: String(currentPage),
      details: name,
    });
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: String(currentPage) });
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseDetails();
    }
  };

  return (
    <div
      className="flex gap-6 max-w-screen-2xl mx-auto px-4 items-center"
      onClick={detailsName ? handleContainerClick : undefined}
    >
      <div className={`flex-1 ${detailsName ? 'w-2/3' : 'w-full'}`}>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          🔍 Pokémon Search
        </h1>
        <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
        {loading && <Spinner />}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        {!loading && !error && pokemons.length > 0 && (
          <>
            <CardList pokemons={pokemons} onCardClick={handleCardClick} />
            {searchTerm.trim() === '' && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onRefresh}
// Improved version with twMerge
className={twMerge(
  // Layout & Spacing
  'px-4 py-2 rounded-lg',
  // Typography
  'text-base font-medium text-white',
  // Background & Colors
  'bg-blue-500 hover:bg-blue-600',
  // Border & Outline States
  'border border-transparent hover:border-blue-400',
  'outline-none hover:outline-blue-400 focus:outline-4 focus:outline-blue-400',
  // Transitions
  'transition-colors'
)}
          >
            🏠 Go to Home & Clear Cache
          </button>
          <button
            onClick={onThrowError}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 outline-none border border-transparent hover:outline-red-400 hover:border-red-400 focus:outline-4 focus:outline-blue-400 transition-colors text-base font-medium"
          >
            Throw error
          </button>
        </div>
      </div>
      {detailsName && (
        <PokemonDetailsPanel
          detailsName={detailsName}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default MainPage;
