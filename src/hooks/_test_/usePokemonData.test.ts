import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePokemonData, type UsePokemonDataConfig } from '../usePokemonData';
import { PokemonService } from '@services/PokemonService';
import type { PokemonDetails } from '@api/pokeapi';

vi.mock('@services/PokemonService');

describe('usePokemonData', () => {
  let mockService: PokemonService;
  let config: UsePokemonDataConfig;

  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    height: 4,
    types: [{ type: { name: 'electric' } }],
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name: 'pikachu' }],
    moves: [{ move: { name: 'thunder-shock' } }],
  };

  const mockPokemonList: PokemonDetails[] = [
    mockPokemon,
    {
      name: 'bulbasaur',
      height: 7,
      types: [{ type: { name: 'grass' } }],
      sprites: {
        front_default: 'https://example.com/bulbasaur.png',
      },
      abilities: [{ ability: { name: 'overgrow' } }],
      forms: [{ name: 'bulbasaur' }],
      moves: [{ move: { name: 'tackle' } }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockService = {
      loadDefaultList: vi.fn(),
      searchByName: vi.fn(),
      getTotalPages: vi.fn(),
    } as unknown as PokemonService;
    config = { service: mockService };
  });

  describe('initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => usePokemonData(config));

      expect(result.current.pokemons).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.loadDefaultList).toBe('function');
      expect(typeof result.current.searchByName).toBe('function');
    });
  });

  describe('loadDefaultList', () => {
    it('should load pokemon list successfully', async () => {
      mockService.loadDefaultList = vi.fn().mockResolvedValue(mockPokemonList);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.loadDefaultList(1);
      });

      expect(mockService.loadDefaultList).toHaveBeenCalledWith(1);
      expect(result.current.pokemons).toEqual(mockPokemonList);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during load', async () => {
      let resolvePromise: (value: PokemonDetails[]) => void;
      const promise = new Promise<PokemonDetails[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockService.loadDefaultList = vi.fn().mockReturnValue(promise);

      const { result } = renderHook(() => usePokemonData(config));

      let loadPromise: Promise<void>;
      await act(async () => {
        loadPromise = result.current.loadDefaultList(1);
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();

      await act(async () => {
        if (resolvePromise) {
          resolvePromise(mockPokemonList);
        }
        if (loadPromise) {
          await loadPromise;
        }
      });

      expect(result.current.loading).toBe(false);
    });

    it('should handle error when loading fails', async () => {
      mockService.loadDefaultList = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.loadDefaultList(1);
      });

      expect(result.current.error).toBe('Error loading default Pokémon');
      expect(result.current.pokemons).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should clear previous error when starting new load', async () => {
      mockService.loadDefaultList = vi
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockPokemonList);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.loadDefaultList(1);
      });

      expect(result.current.error).toBe('Error loading default Pokémon');

      await act(async () => {
        await result.current.loadDefaultList(1);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('searchByName', () => {
    it('should search pokemon by name successfully', async () => {
      mockService.searchByName = vi.fn().mockResolvedValue([mockPokemon]);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.searchByName('pikachu');
      });

      expect(mockService.searchByName).toHaveBeenCalledWith('pikachu');
      expect(result.current.pokemons).toEqual([mockPokemon]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle empty search term by loading default list', async () => {
      mockService.loadDefaultList = vi.fn().mockResolvedValue(mockPokemonList);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.searchByName('');
      });

      expect(mockService.loadDefaultList).toHaveBeenCalledWith(1);
      expect(mockService.searchByName).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it('should handle whitespace-only search term by loading default list', async () => {
      mockService.loadDefaultList = vi.fn().mockResolvedValue(mockPokemonList);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.searchByName('   ');
      });

      expect(mockService.loadDefaultList).toHaveBeenCalledWith(1);
      expect(mockService.searchByName).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it('should handle error when search fails', async () => {
      mockService.searchByName = vi
        .fn()
        .mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.searchByName('nonexistent');
      });

      expect(result.current.error).toBe('No Pokémon found named "nonexistent"');
      expect(result.current.pokemons).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should clear pokemons and set loading state when starting search', async () => {
      let resolvePromise: (value: PokemonDetails[]) => void;
      const promise = new Promise<PokemonDetails[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockService.searchByName = vi.fn().mockReturnValue(promise);

      const { result } = renderHook(() => usePokemonData(config));

      let searchPromise: Promise<void>;
      await act(async () => {
        searchPromise = result.current.searchByName('pikachu');
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.pokemons).toEqual([]);
      expect(result.current.error).toBeNull();

      await act(async () => {
        if (resolvePromise) {
          resolvePromise([mockPokemon]);
        }
        if (searchPromise) {
          await searchPromise;
        }
      });

      expect(result.current.loading).toBe(false);
    });

    it('should clear previous error when starting new search', async () => {
      mockService.searchByName = vi
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce([mockPokemon]);

      const { result } = renderHook(() => usePokemonData(config));

      await act(async () => {
        await result.current.searchByName('nonexistent');
      });

      expect(result.current.error).toBe('No Pokémon found named "nonexistent"');

      await act(async () => {
        await result.current.searchByName('pikachu');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('service reference', () => {
    it('should use the latest service reference', async () => {
      const newService = {
        loadDefaultList: vi.fn().mockResolvedValue(mockPokemonList),
        searchByName: vi.fn(),
        getTotalPages: vi.fn(),
      } as unknown as PokemonService;

      const { result, rerender } = renderHook(
        ({ config }) => usePokemonData(config),
        { initialProps: { config } }
      );

      const updatedConfig = { service: newService };
      rerender({ config: updatedConfig });

      await act(async () => {
        await result.current.loadDefaultList(1);
      });

      expect(newService.loadDefaultList).toHaveBeenCalledWith(1);
      expect(mockService.loadDefaultList).not.toHaveBeenCalled();
    });
  });
});
