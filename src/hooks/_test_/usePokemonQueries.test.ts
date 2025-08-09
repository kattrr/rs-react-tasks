import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { TestQueryClientProvider } from '../../test/queryClient';
import {
  usePokemonList,
  usePokemonSearch,
  usePokemonDetails,
  useInvalidatePokemonCache,
  getTotalPages,
} from '../usePokemonQueries';
import * as api from '@api/pokeapi';
import type { PokemonDetails } from '@api/pokeapi';

vi.mock('../../api/pokeapi');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(TestQueryClientProvider, null, children);
};

describe('usePokemonQueries', () => {
  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    types: [{ type: { name: 'electric' } }],
    height: 4,
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name: 'pikachu' }],
    moves: [{ move: { name: 'thunder-shock' } }],
  };

  const mockPokemonList = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePokemonList', () => {
    it('fetches pokemon list for a given page', async () => {
      vi.mocked(api.fetchPokemonList).mockResolvedValue(mockPokemonList);
      vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

      const { result } = renderHook(() => usePokemonList(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(api.fetchPokemonList).toHaveBeenCalledWith(0, 12);
      expect(api.fetchPokemonByName).toHaveBeenCalledTimes(2);
    });

    it('handles error state', async () => {
      vi.mocked(api.fetchPokemonList).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => usePokemonList(1), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('usePokemonSearch', () => {
    it('fetches pokemon by search term', async () => {
      vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

      const { result } = renderHook(() => usePokemonSearch('pikachu'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(api.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    });

    it('is disabled for empty search term', () => {
      const { result } = renderHook(() => usePokemonSearch(''), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('usePokemonDetails', () => {
    it('fetches pokemon details by name', async () => {
      vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

      const { result } = renderHook(() => usePokemonDetails('pikachu'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(api.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
    });

    it('is disabled when name is null', () => {
      const { result } = renderHook(() => usePokemonDetails(null), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useInvalidatePokemonCache', () => {
    it('provides cache invalidation functions', () => {
      const { result } = renderHook(() => useInvalidatePokemonCache(), {
        wrapper,
      });

      expect(result.current.invalidateAll).toBeInstanceOf(Function);
      expect(result.current.invalidateList).toBeInstanceOf(Function);
      expect(result.current.invalidateSearch).toBeInstanceOf(Function);
      expect(result.current.invalidateDetails).toBeInstanceOf(Function);
    });
  });

  describe('getTotalPages', () => {
    it('calculates total pages correctly', () => {
      const totalPages = getTotalPages();
      expect(totalPages).toBe(Math.ceil(1302 / 12));
    });
  });
});
