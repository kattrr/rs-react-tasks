import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokemonService, type PokemonServiceConfig } from '../PokemonService';
import * as pokeapi from '@api/pokeapi';
import type { PokemonDetails } from '@api/pokeapi';

vi.mock('@api/pokeapi');

const mockFetchPokemonList = vi.mocked(pokeapi.fetchPokemonList);
const mockFetchPokemonByName = vi.mocked(pokeapi.fetchPokemonByName);

describe('PokemonService', () => {
  let service: PokemonService;
  const config: PokemonServiceConfig = {
    pageSize: 20,
    totalPokemons: 100,
  };

  beforeEach(() => {
    service = new PokemonService(config);
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(service).toBeInstanceOf(PokemonService);
    });
  });

  describe('loadDefaultList', () => {
    it('should load pokemon list with pagination', async () => {
      const mockList = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ];
      const mockDetails: PokemonDetails[] = [
        {
          name: 'bulbasaur',
          height: 7,
          types: [],
          sprites: {
            front_default: 'https://example.com/bulbasaur.png',
          },
          abilities: [],
          forms: [],
          moves: [],
        },
        {
          name: 'ivysaur',
          height: 10,
          types: [],
          sprites: {
            front_default: 'https://example.com/ivysaur.png',
          },
          abilities: [],
          forms: [],
          moves: [],
        },
      ];

      mockFetchPokemonList.mockResolvedValue(mockList);
      mockFetchPokemonByName
        .mockResolvedValueOnce(mockDetails[0])
        .mockResolvedValueOnce(mockDetails[1]);

      const promise = service.loadDefaultList(1);

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(mockFetchPokemonList).toHaveBeenCalledWith(0, 20);
      expect(mockFetchPokemonByName).toHaveBeenCalledWith('bulbasaur');
      expect(mockFetchPokemonByName).toHaveBeenCalledWith('ivysaur');
      expect(result).toEqual(mockDetails);
    });

    it('should calculate correct offset for different pages', async () => {
      const mockList = [
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ];
      const mockDetails: PokemonDetails = {
        name: 'charmander',
        height: 6,
        types: [],
        sprites: {
          front_default: 'https://example.com/charmander.png',
        },
        abilities: [],
        forms: [],
        moves: [],
      };

      mockFetchPokemonList.mockResolvedValue(mockList);
      mockFetchPokemonByName.mockResolvedValue(mockDetails);

      const promise = service.loadDefaultList(2);
      await vi.runAllTimersAsync();
      await promise;

      expect(mockFetchPokemonList).toHaveBeenCalledWith(20, 20);
    });
  });

  describe('searchByName', () => {
    it('should return empty array for empty search term', async () => {
      const result = await service.searchByName('');
      expect(result).toEqual([]);
    });

    it('should return empty array for whitespace only search term', async () => {
      const result = await service.searchByName('   ');
      expect(result).toEqual([]);
    });

    it('should search pokemon by name', async () => {
      const mockDetails: PokemonDetails = {
        name: 'bulbasaur',
        height: 7,
        types: [],
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
        abilities: [],
        forms: [],
        moves: [],
      };
      mockFetchPokemonByName.mockResolvedValue(mockDetails);

      const promise = service.searchByName('bulbasaur');
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(mockFetchPokemonByName).toHaveBeenCalledWith('bulbasaur');
      expect(result).toEqual([mockDetails]);
    });

    it('should convert search term to lowercase', async () => {
      const mockDetails: PokemonDetails = {
        name: 'bulbasaur',
        height: 7,
        types: [],
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
        abilities: [],
        forms: [],
        moves: [],
      };
      mockFetchPokemonByName.mockResolvedValue(mockDetails);

      const promise = service.searchByName('BULBASAUR');
      await vi.runAllTimersAsync();
      await promise;

      expect(mockFetchPokemonByName).toHaveBeenCalledWith('bulbasaur');
    });
  });

  describe('getTotalPages', () => {
    it('should calculate total pages correctly', () => {
      const result = service.getTotalPages();
      expect(result).toBe(5);
    });

    it('should handle different config values', () => {
      const customService = new PokemonService({
        pageSize: 10,
        totalPokemons: 25,
      });
      const result = customService.getTotalPages();
      expect(result).toBe(3);
    });

    it('should handle exact division', () => {
      const customService = new PokemonService({
        pageSize: 20,
        totalPokemons: 40,
      });
      const result = customService.getTotalPages();
      expect(result).toBe(2);
    });
  });

  describe('RateLimiter', () => {
    it('should execute functions with delay', async () => {
      const mockList = [
        { name: 'test', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ];
      const mockDetails: PokemonDetails = {
        name: 'test',
        height: 7,
        types: [],
        sprites: {
          front_default: 'https://example.com/test.png',
        },
        abilities: [],
        forms: [],
        moves: [],
      };

      mockFetchPokemonList.mockResolvedValue(mockList);
      mockFetchPokemonByName.mockResolvedValue(mockDetails);

      const promise = service.loadDefaultList(1);

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual([mockDetails]);
    });
  });
});
