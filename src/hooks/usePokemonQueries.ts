import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemonByName } from '@api/pokeapi';
import type { PokemonDetails } from '@api/pokeapi';

const POKEMON_CONFIG = {
  pageSize: 12,
  totalPokemons: 1302,
};

export const usePokemonList = (page: number) => {
  return useQuery<PokemonDetails[], Error>({
    queryKey: ['pokemon-list', page],
    queryFn: async () => {
      const offset = (page - 1) * POKEMON_CONFIG.pageSize;
      const list = await fetchPokemonList(offset, POKEMON_CONFIG.pageSize);

      const detailedResults = await Promise.allSettled(
        list.map((p) => fetchPokemonByName(p.name))
      );

      return detailedResults
        .filter(
          (result): result is PromiseFulfilledResult<PokemonDetails> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);
    },
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

export const usePokemonSearch = (searchTerm: string) => {
  return useQuery<PokemonDetails[], Error>({
    queryKey: ['pokemon-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      try {
        const pokemon = await fetchPokemonByName(searchTerm.toLowerCase());
        return [pokemon];
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error(`Pokémon "${searchTerm}" not found`);
      }
    },
    enabled: !!searchTerm.trim(),
    retry: false,
  });
};

export const usePokemonDetails = (name: string | null) => {
  return useQuery<PokemonDetails, Error>({
    queryKey: ['pokemon-details', name],
    queryFn: () => {
      if (!name) throw new Error('Name is required');
      return fetchPokemonByName(name);
    },
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useInvalidatePokemonCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon-list'] });
      queryClient.invalidateQueries({ queryKey: ['pokemon-search'] });
      queryClient.invalidateQueries({ queryKey: ['pokemon-details'] });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon-list'] });
    },
    invalidateSearch: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon-search'] });
    },
    invalidateDetails: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon-details'] });
    },
  };
};

export const getTotalPages = () => {
  return Math.ceil(POKEMON_CONFIG.totalPokemons / POKEMON_CONFIG.pageSize);
};
