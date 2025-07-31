import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedItemsFlyout from '../SelectedItemsFlyout';

// Mock the store
vi.mock('../../store/selectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn()
}));

import { useSelectedItemsStore } from '../../store/selectedItemsStore';
const mockUseSelectedItemsStore = useSelectedItemsStore as vi.MockedFunction<typeof useSelectedItemsStore>;

describe('SelectedItemsFlyout component', () => {
  const mockSelectedItems = [
    {
      id: 'pikachu',
      name: 'pikachu',
      description: 'Type: electric',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    },
    {
      id: 'charizard',
      name: 'charizard',
      description: 'Type: fire, flying',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/charizard',
      imageUrl: 'https://example.com/charizard.png',
      types: ['fire', 'flying']
    }
  ];

  const mockClearAll = vi.fn();
  const mockGetSelectedCount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: [],
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount
    });
  });

  describe('conditional rendering', () => {
    it('should not render when selectedCount is 0', () => {
      mockGetSelectedCount.mockReturnValue(0);
      
      const { container } = render(<SelectedItemsFlyout />);
      expect(container.firstChild).toBeNull();
    });

    it('should render when items are selected', () => {
      mockGetSelectedCount.mockReturnValue(2);
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: mockSelectedItems,
        clearAll: mockClearAll,
        getSelectedCount: mockGetSelectedCount
      });
      
      render(<SelectedItemsFlyout />);
      expect(screen.getByText('2 items are selected')).toBeInTheDocument();
    });

    it('should render singular text for one item', () => {
      mockGetSelectedCount.mockReturnValue(1);
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: [mockSelectedItems[0]],
        clearAll: mockClearAll,
        getSelectedCount: mockGetSelectedCount
      });
      
      render(<SelectedItemsFlyout />);
      expect(screen.getByText('1 item is selected')).toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    beforeEach(() => {
      mockGetSelectedCount.mockReturnValue(2);
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: mockSelectedItems,
        clearAll: mockClearAll,
        getSelectedCount: mockGetSelectedCount
      });
    });

    it('should call clearAll when unselect button is clicked', () => {
      render(<SelectedItemsFlyout />);
      
      const unselectButton = screen.getByText('Unselect all');
      fireEvent.click(unselectButton);
      
      expect(mockClearAll).toHaveBeenCalledTimes(1);
    });

    it('should render both buttons', () => {
      render(<SelectedItemsFlyout />);
      
      expect(screen.getByText('Unselect all')).toBeInTheDocument();
      expect(screen.getByText('Download')).toBeInTheDocument();
    });
  });

  describe('CSV download functionality', () => {
    beforeEach(() => {
      mockGetSelectedCount.mockReturnValue(2);
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: mockSelectedItems,
        clearAll: mockClearAll,
        getSelectedCount: mockGetSelectedCount
      });
    });

    it('should handle early return when count is 0', () => {
      mockGetSelectedCount.mockReturnValue(0);
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: [],
        clearAll: mockClearAll,
        getSelectedCount: mockGetSelectedCount
      });
      
      render(<SelectedItemsFlyout />);
      
      // Component should not render, so no download functionality
      expect(screen.queryByText('Download')).not.toBeInTheDocument();
    });

    it('should render download button when items are selected', () => {
      render(<SelectedItemsFlyout />);
      
      const downloadButton = screen.getByText('Download');
      expect(downloadButton).toBeInTheDocument();
    });

    it('should handle download button click without errors', () => {
      // Mock Blob constructor to prevent errors
      const mockBlob = vi.fn();
      global.Blob = mockBlob;
      
      // Mock URL.createObjectURL
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true,
      });
      
      render(<SelectedItemsFlyout />);
      
      const downloadButton = screen.getByText('Download');
      
      // This should not throw an error
      expect(() => {
        fireEvent.click(downloadButton);
      }).not.toThrow();
    });

    it('should handle items with multiple types correctly', () => {
      const itemsWithMultipleTypes = [
        {
          id: 'charizard',
          name: 'charizard',
          description: 'Type: fire, flying',
          detailsUrl: 'https://pokeapi.co/api/v2/pokemon/charizard',
          imageUrl: 'https://example.com/charizard.png',
          types: ['fire', 'flying']
        }
      ];
      
      mockUseSelectedItemsStore.mockReturnValue({
        selectedItems: itemsWithMultipleTypes,
        clearAll: mockClearAll,
        getSelectedCount: () => 1
      });

      // Mock Blob constructor
      const mockBlob = vi.fn();
      global.Blob = mockBlob;
      
      // Mock URL.createObjectURL
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true,
      });
      
      render(<SelectedItemsFlyout />);
      
      const downloadButton = screen.getByText('Download');
      
      // This should not throw an error
      expect(() => {
        fireEvent.click(downloadButton);
      }).not.toThrow();
    });
  });
}); 