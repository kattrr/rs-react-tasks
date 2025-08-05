import { useState, useCallback, useRef } from 'react';
import { PokemonService } from '@services/PokemonService';
import type { PokemonDetails } from '@api/pokeapi';

export interface UsePokemonDataConfig {
  service: PokemonService;
}

export interface PokemonDataState {
  pokemons: PokemonDetails[];
  loading: boolean;
  error: string | null;
}

export const usePokemonData = ({ service }: UsePokemonDataConfig) => {
  const serviceRef = useRef(service);
  serviceRef.current = service;

  const [state, setState] = useState<PokemonDataState>({
    pokemons: [],
    loading: false,
    error: null,
  });

  const loadDefaultList = useCallback(async (page: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const pokemons = await serviceRef.current.loadDefaultList(page);
      setState({ pokemons, loading: false, error: null });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Error loading default Pokémon',
      }));
    }
  }, []);

  const searchByName = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        await loadDefaultList(1);
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        pokemons: [],
      }));
      try {
        const pokemons = await serviceRef.current.searchByName(term);
        setState({ pokemons, loading: false, error: null });
      } catch {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: `No Pokémon found named "${term}"`,
        }));
      }
    },
    [loadDefaultList]
  );

  return {
    ...state,
    loadDefaultList,
    searchByName,
  };
};
