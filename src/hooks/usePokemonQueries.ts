import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemonByName } from '@api/pokeapi';

const POKEMON_CONFIG = {
  pageSize: 12,
  totalPokemons: 1302,
};

export const usePokemonList = (page: number) => {
  return useQuery({
    queryKey: ['pokemon-list', page],
    queryFn: async () => {
      const offset = (page - 1) * POKEMON_CONFIG.pageSize;
      const list = await fetchPokemonList(offset, POKEMON_CONFIG.pageSize);
      const detailed = await Promise.all(
        list.map((p) => fetchPokemonByName(p.name))
      );
      return detailed;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePokemonSearch = (
  searchTerm: string,
  searchTrigger?: string
) => {
  // Extract the actual search term from the trigger (remove timestamp)
  const actualSearchTerm =
    searchTrigger && searchTrigger.includes('-')
      ? searchTrigger.split('-')[0]
      : searchTerm;

  return useQuery({
    queryKey: ['pokemon-search', actualSearchTerm, searchTrigger],
    queryFn: async () => {
      if (!actualSearchTerm.trim()) {
        return [];
      }
      const pokemon = await fetchPokemonByName(actualSearchTerm.toLowerCase());
      return [pokemon];
    },
    enabled: actualSearchTerm.trim().length > 0 && searchTrigger !== '',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePokemonDetails = (name: string | null) => {
  return useQuery({
    queryKey: ['pokemon-details', name],
    queryFn: () => {
      if (!name) {
        throw new Error('Name is required');
      }
      return fetchPokemonByName(name);
    },
    enabled: !!name,
    staleTime: 10 * 60 * 1000, // 10 minutes for details
    gcTime: 15 * 60 * 1000, // 15 minutes
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
