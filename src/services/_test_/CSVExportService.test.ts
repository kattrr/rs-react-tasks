import { describe, it, expect } from 'vitest';
import { exportSelectedItems } from '../CSVExportService';
import type { SelectedItem } from '@store/selectedItemsStore';

describe('CSVExportService', () => {
  const mockItems: SelectedItem[] = [
    {
      id: 'pikachu',
      name: 'pikachu',
      description: 'Type: electric',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric'],
    },
    {
      id: 'charizard',
      name: 'charizard',
      description: 'Type: fire, flying',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/charizard',
      imageUrl: 'https://example.com/charizard.png',
      types: ['fire', 'flying'],
    },
  ];

  describe('exportSelectedItems', () => {
    it('should return empty string when items array is empty', () => {
      const result = exportSelectedItems([]);
      expect(result).toBe('');
    });

    it('should create CSV content with correct headers', () => {
      const result = exportSelectedItems(mockItems);

      expect(result).toContain('Name,Description,Details URL,Image URL,Types');
      expect(result).toContain(
        'pikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric'
      );
      expect(result).toContain(
        'charizard,Type: fire, flying,https://pokeapi.co/api/v2/pokemon/charizard,https://example.com/charizard.png,fire;flying'
      );
    });

    it('should create CSV content with correct data rows', () => {
      const result = exportSelectedItems(mockItems);

      expect(result).toContain(
        'pikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric'
      );
      expect(result).toContain(
        'charizard,Type: fire, flying,https://pokeapi.co/api/v2/pokemon/charizard,https://example.com/charizard.png,fire;flying'
      );
    });

    it('should return CSV string with correct format', () => {
      const result = exportSelectedItems(mockItems);

      const lines = result.split('\n');
      expect(lines).toHaveLength(3); // Header + 2 data rows
      expect(lines[0]).toBe('Name,Description,Details URL,Image URL,Types');
      expect(lines[1]).toContain('pikachu');
      expect(lines[2]).toContain('charizard');
    });

    it('should handle items with multiple types correctly', () => {
      const itemsWithMultipleTypes: SelectedItem[] = [
        {
          id: 'venusaur',
          name: 'venusaur',
          description: 'Type: grass, poison',
          detailsUrl: 'https://pokeapi.co/api/v2/pokemon/venusaur',
          imageUrl: 'https://example.com/venusaur.png',
          types: ['grass', 'poison'],
        },
      ];

      const result = exportSelectedItems(itemsWithMultipleTypes);

      expect(result).toContain(
        'venusaur,Type: grass, poison,https://pokeapi.co/api/v2/pokemon/venusaur,https://example.com/venusaur.png,grass;poison'
      );
    });

    it('should handle items with single type correctly', () => {
      const itemsWithSingleType: SelectedItem[] = [
        {
          id: 'pikachu',
          name: 'pikachu',
          description: 'Type: electric',
          detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
          imageUrl: 'https://example.com/pikachu.png',
          types: ['electric'],
        },
      ];

      const result = exportSelectedItems(itemsWithSingleType);

      expect(result).toContain(
        'pikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric'
      );
    });

    it('should handle items with special characters in description', () => {
      const itemsWithSpecialChars: SelectedItem[] = [
        {
          id: 'mewtwo',
          name: 'mewtwo',
          description: 'Type: psychic (Legendary)',
          detailsUrl: 'https://pokeapi.co/api/v2/pokemon/mewtwo',
          imageUrl: 'https://example.com/mewtwo.png',
          types: ['psychic'],
        },
      ];

      const result = exportSelectedItems(itemsWithSpecialChars);

      expect(result).toContain(
        'mewtwo,Type: psychic (Legendary),https://pokeapi.co/api/v2/pokemon/mewtwo,https://example.com/mewtwo.png,psychic'
      );
    });

    it('should return CSV string with proper formatting', () => {
      const result = exportSelectedItems(mockItems);

      expect(result).toContain('Name,Description,Details URL,Image URL,Types');
      expect(result.split('\n')).toHaveLength(3);
    });
  });
});
