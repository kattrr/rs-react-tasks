import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportCSVAction } from '../exportCSV';

vi.mock('@/services/CSVExportService', () => ({
  exportSelectedItems: vi.fn(),
}));

import { exportSelectedItems } from '@/services/CSVExportService';

const mockExportSelectedItems = vi.mocked(exportSelectedItems);

describe('exportCSVAction', () => {
  const mockItems = [
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success response with CSV data when items exist', async () => {
    const mockCSVContent =
      'Name,Description,Details URL,Image URL,Types\npikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric\ncharizard,Type: fire flying,https://pokeapi.co/api/v2/pokemon/charizard,https://example.com/charizard.png,fire flying';

    mockExportSelectedItems.mockReturnValue(mockCSVContent);

    const result = await exportCSVAction(mockItems, 'pokemon_list.csv');

    expect(result).toEqual({
      success: true,
      data: mockCSVContent,
      filename: 'pokemon_list.csv',
    });

    expect(mockExportSelectedItems).toHaveBeenCalledWith(mockItems);
  });

  it('should return failure response when items array is empty', async () => {
    const result = await exportCSVAction([], 'empty_list.csv');

    expect(result).toEqual({
      success: false,
      data: '',
      filename: '',
    });

    expect(mockExportSelectedItems).not.toHaveBeenCalled();
  });

  it('should handle CSV download error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockExportSelectedItems.mockImplementation(() => {
      throw new Error('CSV generation failed');
    });

    const result = await exportCSVAction(mockItems, 'error_list.csv');

    expect(result).toEqual({
      success: false,
      data: '',
      filename: '',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error exporting CSV on server:',
      expect.any(Error)
    );
    expect(mockExportSelectedItems).toHaveBeenCalledWith(mockItems);

    consoleSpy.mockRestore();
  });

  it('should handle single item correctly', async () => {
    const singleItem = [mockItems[0]];
    const mockCSVContent =
      'Name,Description,Details URL,Image URL,Types\npikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric';

    mockExportSelectedItems.mockReturnValue(mockCSVContent);

    const result = await exportCSVAction(singleItem, 'single_pokemon.csv');

    expect(result).toEqual({
      success: true,
      data: mockCSVContent,
      filename: 'single_pokemon.csv',
    });

    expect(mockExportSelectedItems).toHaveBeenCalledWith(singleItem);
  });

  it('should handle items with empty or null values', async () => {
    const itemsWithEmptyValues = [
      {
        id: '',
        name: '',
        description: '',
        detailsUrl: '',
        imageUrl: '',
        types: [],
      },
    ];

    const mockCSVContent = 'Name,Description,Details URL,Image URL,Types\n,,,,';

    mockExportSelectedItems.mockReturnValue(mockCSVContent);

    const result = await exportCSVAction(
      itemsWithEmptyValues,
      'empty_values.csv'
    );

    expect(result).toEqual({
      success: true,
      data: mockCSVContent,
      filename: 'empty_values.csv',
    });

    expect(mockExportSelectedItems).toHaveBeenCalledWith(itemsWithEmptyValues);
  });
});
