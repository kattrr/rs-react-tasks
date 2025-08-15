'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CardList, Spinner, SearchBar } from '@components';
import Pagination from '@components/Pagination';
import PokemonDetailsPanel from '@components/PokemonDetailsPanel';
import type { PokemonDetails } from '@api/pokeapi';
import { fetchPokemonByName, fetchPokemonList } from '@api/pokeapi';
import { twMerge } from 'tailwind-merge';

interface ClientMainPageProps {
  initialPokemonList: PokemonDetails[];
}

const ClientMainPage = ({ initialPokemonList }: ClientMainPageProps) => {
  const t = useTranslations();
  const [pokemons, setPokemons] =
    useState<PokemonDetails[]>(initialPokemonList);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailsName, setDetailsName] = useState<string | null>(null);

  const TOTAL_POKEMON_COUNT = 1302;
  const PAGE_SIZE = 12;

  useMemo(() => {
    setTotalPages(Math.ceil(TOTAL_POKEMON_COUNT / PAGE_SIZE));
  }, []);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setSearchTerm(term);

    try {
      const trimmed = term.trim();
      if (trimmed === '') {
        setPokemons(initialPokemonList);
        setCurrentPage(1);
        setError(null);
        return;
      }

      const result = await fetchPokemonByName(trimmed);
      setPokemons([result]);
      setCurrentPage(1);
      setError(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;

    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * PAGE_SIZE;
      const pokemonList = await fetchPokemonList(offset, PAGE_SIZE);

      const pokemonDetails = await Promise.all(
        pokemonList.map((pokemon) => fetchPokemonByName(pokemon.name))
      );

      setPokemons(pokemonDetails);
      setCurrentPage(page);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (name: string) => {
    setDetailsName(name);
  };

  const handleCloseDetails = () => {
    setDetailsName(null);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseDetails();
    }
  };

  const handleRefresh = () => {
    setPokemons(initialPokemonList);
    setCurrentPage(1);
    setDetailsName(null);
    setError(null);
    setSearchTerm('');
  };

  const handleThrowError = () => {
    throw new Error('This is a test error to demonstrate error boundary');
  };

  const showPagination = searchTerm.trim() === '' && totalPages > 1;

  return (
    <div
      className="flex gap-6 max-w-screen-2xl mx-auto px-4 items-center"
      onClick={detailsName ? handleContainerClick : undefined}
    >
      <div className={`flex-1 ${detailsName ? 'w-2/3' : 'w-full'}`}>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {t('mainPage.title')}
        </h1>
        <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
        {loading && <Spinner />}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        {!loading && !error && pokemons.length > 0 && (
          <>
            <CardList pokemons={pokemons} onCardClick={handleCardClick} />
            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleRefresh}
            className={twMerge(
              'px-4 py-2 rounded-lg',
              'text-base font-medium text-white',
              'bg-blue-500 hover:bg-blue-600',
              'border border-transparent hover:border-blue-400',
              'outline-none hover:outline-blue-400 focus:outline-4 focus:outline-blue-400',
              'transition-colors'
            )}
          >
            {t('mainPage.goHomeButton')}
          </button>
          <button
            onClick={handleThrowError}
            className={twMerge(
              'bg-red-500 hover:bg-red-600 transition-colors',
              'px-4 py-2 rounded-lg',
              'text-base font-medium text-white',
              'border border-transparent hover:border-red-400',
              'outline-none hover:outline-red-400 focus:outline-4 focus:outline-blue-400'
            )}
          >
            {t('mainPage.throwErrorButton')}
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

export default ClientMainPage;
