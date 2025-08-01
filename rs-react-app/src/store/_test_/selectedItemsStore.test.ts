import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from '../selectedItemsStore';
import type { PokemonDetails } from '../../api/pokeapi';

describe('selectedItemsStore', () => {
  let store: ReturnType<typeof useSelectedItemsStore>;

  beforeEach(() => {
    store = useSelectedItemsStore.getState();
    store.clearAll();
  });

  describe('addItem', () => {
    it('should add a new item when it does not exist', () => {
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

      store.addItem(mockPokemon);

      const state = useSelectedItemsStore.getState();
      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0]).toEqual({
        id: 'pikachu',
        name: 'pikachu',
        description: 'Type: electric',
        detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
        imageUrl: 'https://example.com/pikachu.png',
        types: ['electric'],
      });
    });

    it('should not add duplicate items', () => {
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

      store.addItem(mockPokemon);
      store.addItem(mockPokemon);

      const state = useSelectedItemsStore.getState();
      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0].id).toBe('pikachu');
    });

    it('should handle pokemon with multiple types', () => {
      const mockPokemon: PokemonDetails = {
        name: 'charizard',
        sprites: {
          front_default: 'https://example.com/charizard.png',
        },
        types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
        height: 17,
        abilities: [{ ability: { name: 'blaze' } }],
        forms: [{ name: 'charizard' }],
        moves: [{ move: { name: 'flamethrower' } }],
      };

      store.addItem(mockPokemon);

      const state = useSelectedItemsStore.getState();
      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0]).toEqual({
        id: 'charizard',
        name: 'charizard',
        description: 'Type: fire, flying',
        detailsUrl: 'https://pokeapi.co/api/v2/pokemon/charizard',
        imageUrl: 'https://example.com/charizard.png',
        types: ['fire', 'flying'],
      });
    });

    it('should handle pokemon with no types', () => {
      const mockPokemon: PokemonDetails = {
        name: 'unknown',
        sprites: {
          front_default: 'https://example.com/unknown.png',
        },
        types: [],
        height: 0,
        abilities: [],
        forms: [],
        moves: [],
      };

      store.addItem(mockPokemon);

      const state = useSelectedItemsStore.getState();
      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0]).toEqual({
        id: 'unknown',
        name: 'unknown',
        description: 'Type: ',
        detailsUrl: 'https://pokeapi.co/api/v2/pokemon/unknown',
        imageUrl: 'https://example.com/unknown.png',
        types: [],
      });
    });
  });

  describe('removeItem', () => {
    it('should remove an existing item', () => {
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

      store.addItem(mockPokemon);
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);

      store.removeItem('pikachu');
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
    });

    it('should not remove non-existent item', () => {
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

      store.addItem(mockPokemon);
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);

      store.removeItem('non-existent');
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);
    });

    it('should remove specific item when multiple items exist', () => {
      const mockPokemon1: PokemonDetails = {
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

      const mockPokemon2: PokemonDetails = {
        name: 'charizard',
        sprites: {
          front_default: 'https://example.com/charizard.png',
        },
        types: [{ type: { name: 'fire' } }],
        height: 17,
        abilities: [{ ability: { name: 'blaze' } }],
        forms: [{ name: 'charizard' }],
        moves: [{ move: { name: 'flamethrower' } }],
      };

      store.addItem(mockPokemon1);
      store.addItem(mockPokemon2);
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(2);

      store.removeItem('pikachu');
      const state = useSelectedItemsStore.getState();
      expect(state.selectedItems).toHaveLength(1);
      expect(state.selectedItems[0].id).toBe('charizard');
    });
  });

  describe('isSelected', () => {
    it('should return true for existing item', () => {
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

      store.addItem(mockPokemon);
      expect(store.isSelected('pikachu')).toBe(true);
    });

    it('should return false for non-existent item', () => {
      expect(store.isSelected('non-existent')).toBe(false);
    });

    it('should return false for empty store', () => {
      expect(store.isSelected('pikachu')).toBe(false);
    });

    it('should return true for one item and false for others', () => {
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

      store.addItem(mockPokemon);
      expect(store.isSelected('pikachu')).toBe(true);
      expect(store.isSelected('charizard')).toBe(false);
    });
  });

  describe('getSelectedCount', () => {
    it('should return 0 for empty store', () => {
      expect(store.getSelectedCount()).toBe(0);
    });

    it('should return 1 for single item', () => {
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

      store.addItem(mockPokemon);
      expect(store.getSelectedCount()).toBe(1);
    });

    it('should return correct count for multiple items', () => {
      const mockPokemon1: PokemonDetails = {
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

      const mockPokemon2: PokemonDetails = {
        name: 'charizard',
        sprites: {
          front_default: 'https://example.com/charizard.png',
        },
        types: [{ type: { name: 'fire' } }],
        height: 17,
        abilities: [{ ability: { name: 'blaze' } }],
        forms: [{ name: 'charizard' }],
        moves: [{ move: { name: 'flamethrower' } }],
      };

      store.addItem(mockPokemon1);
      expect(store.getSelectedCount()).toBe(1);

      store.addItem(mockPokemon2);
      expect(store.getSelectedCount()).toBe(2);

      store.removeItem('pikachu');
      expect(store.getSelectedCount()).toBe(1);
    });

    it('should return 0 after clearAll', () => {
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

      store.addItem(mockPokemon);
      expect(store.getSelectedCount()).toBe(1);

      store.clearAll();
      expect(store.getSelectedCount()).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should clear all items', () => {
      const mockPokemon1: PokemonDetails = {
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

      const mockPokemon2: PokemonDetails = {
        name: 'charizard',
        sprites: {
          front_default: 'https://example.com/charizard.png',
        },
        types: [{ type: { name: 'fire' } }],
        height: 17,
        abilities: [{ ability: { name: 'blaze' } }],
        forms: [{ name: 'charizard' }],
        moves: [{ move: { name: 'flamethrower' } }],
      };

      store.addItem(mockPokemon1);
      store.addItem(mockPokemon2);
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(2);

      store.clearAll();
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
    });

    it('should work on empty store', () => {
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
      store.clearAll();
      expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
    });
  });
});
