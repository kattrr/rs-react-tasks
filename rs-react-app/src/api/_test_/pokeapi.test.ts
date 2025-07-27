import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemonByName,
  type PokemonDetails,
} from '../pokeapi';

globalThis.fetch = vi.fn();

const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('pokeapi.ts', () => {
  describe('fetchPokemonList', () => {
    it('returns a list of pokémon', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          ],
        }),
      });

      const list = await fetchPokemonList(0, 2);
      expect(list).toHaveLength(2);
      expect(list[0].name).toBe('bulbasaur');
    });

    it('throws an error if the request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchPokemonList()).rejects.toThrow('Error fetching list');
    });
  });

  describe('fetchPokemonByName', () => {
    it('returns a pokémon detail object', async () => {
      const mockData: PokemonDetails = {
        name: 'pikachu',
        sprites: {
          front_default: 'https://example.com/pikachu.png',
        },
        types: [{ type: { name: 'electric' } }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchPokemonByName('pikachu');
      expect(result.name).toBe('pikachu');
      expect(result.types[0].type.name).toBe('electric');
    });

    it('throws an error if the pokémon is not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchPokemonByName('missingno')).rejects.toThrow(
        'Pokémon "missingno" not found (404)'
      );
    });
  });
});
