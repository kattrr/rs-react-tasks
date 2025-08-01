import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportSelectedItems } from '../CSVExportService';
import type { SelectedItem } from '../../store/selectedItemsStore';

type MockedBlob = vi.MockedFunction<typeof Blob>;

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

  let mockLink: HTMLElement;
  let mockBlob: Blob;
  let mockCreateObjectURL: (blob: Blob) => string;
  let mockRevokeObjectURL: (url: string) => void;

  beforeEach(() => {
    mockBlob = {
      content: '',
      options: {},
      size: 0,
      type: '',
    } as unknown as Blob;
    globalThis.Blob = vi.fn().mockImplementation((content, options) => {
      mockBlob.content = content;
      mockBlob.options = options;
      return mockBlob;
    });

    mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    Object.defineProperty(URL, 'createObjectURL', {
      value: mockCreateObjectURL,
      writable: true,
    });

    mockRevokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: mockRevokeObjectURL,
      writable: true,
    });

    mockLink = {
      setAttribute: vi.fn(),
      style: { visibility: 'hidden' },
      click: vi.fn(),
    } as unknown as HTMLElement;
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockLink;
      }
      return document.createElement(tagName);
    });

    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportSelectedItems', () => {
    it('should return early when items array is empty', () => {
      expect(() => {
        exportSelectedItems([], 'test.csv');
      }).not.toThrow();

      expect(document.createElement).not.toHaveBeenCalled();
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('should create CSV content with correct headers', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(globalThis.Blob).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining(
            'Name,Description,Details URL,Image URL,Types'
          ),
        ]),
        { type: 'text/csv;charset=utf-8;' }
      );
    });

    it('should create CSV content with correct data rows', () => {
      exportSelectedItems(mockItems, 'test.csv');

      const blobCall = (globalThis.Blob as MockedBlob).mock.calls[0];
      const csvContent = blobCall[0][0];

      expect(csvContent).toContain(
        'pikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric'
      );
      expect(csvContent).toContain(
        'charizard,Type: fire, flying,https://pokeapi.co/api/v2/pokemon/charizard,https://example.com/charizard.png,fire;flying'
      );
    });

    it('should create blob with correct type', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(globalThis.Blob).toHaveBeenCalledWith(expect.any(Array), {
        type: 'text/csv;charset=utf-8;',
      });
    });

    it('should create download link with correct attributes', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'href',
        'blob:mock-url'
      );
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'test.csv'
      );
    });

    it('should set link style to hidden', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(mockLink.style.visibility).toBe('hidden');
    });

    it('should append link to document body', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should click the link', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(mockLink.click).toHaveBeenCalledTimes(1);
    });

    it('should remove link from document body', () => {
      exportSelectedItems(mockItems, 'test.csv');

      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
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

      exportSelectedItems(itemsWithMultipleTypes, 'test.csv');

      const blobCall = (globalThis.Blob as MockedBlob).mock.calls[0];
      const csvContent = blobCall[0][0];

      expect(csvContent).toContain(
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

      exportSelectedItems(itemsWithSingleType, 'test.csv');

      const blobCall = (globalThis.Blob as MockedBlob).mock.calls[0];
      const csvContent = blobCall[0][0];

      expect(csvContent).toContain(
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

      exportSelectedItems(itemsWithSpecialChars, 'test.csv');

      const blobCall = (globalThis.Blob as MockedBlob).mock.calls[0];
      const csvContent = blobCall[0][0];

      expect(csvContent).toContain(
        'mewtwo,Type: psychic (Legendary),https://pokeapi.co/api/v2/pokemon/mewtwo,https://example.com/mewtwo.png,psychic'
      );
    });

    it('should use provided filename for download', () => {
      exportSelectedItems(mockItems, 'pokemon_list.csv');

      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'pokemon_list.csv'
      );
    });
  });
});
