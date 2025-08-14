import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedItemsFlyout from '../SelectedItemsFlyout';

vi.mock('../../store/selectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn(),
}));

vi.mock('../../app/actions', () => ({
  exportCSVAction: vi.fn(),
}));

import { useSelectedItemsStore } from '@store/selectedItemsStore';
import { exportCSVAction } from '../../app/actions';

const mockUseSelectedItemsStore = vi.mocked(useSelectedItemsStore);
const mockExportCSVAction = vi.mocked(exportCSVAction);

describe('SelectedItemsFlyout component', () => {
  const mockSelectedItems = [
    {
      id: 'pikachu',
      name: 'pikachu',
      description: 'Type: electric',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric'],
    },
  ];

  const mockClearAll = vi.fn();
  const mockGetSelectedCount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when selectedCount is 0', () => {
    mockGetSelectedCount.mockReturnValue(0);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: [],
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });

    const { container } = render(<SelectedItemsFlyout />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when items are selected', () => {
    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });

    render(<SelectedItemsFlyout />);
    expect(screen.getByText('1 item is selected')).toBeInTheDocument();
  });

  it('should handle successful CSV download', async () => {
    const mockResult = {
      success: true,
      data: 'Name,Description,Details URL,Image URL,Types\npikachu,Type: electric,https://pokeapi.co/api/v2/pokemon/pikachu,https://example.com/pikachu.png,electric',
      filename: '1_pokemon_export.csv',
    };

    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });
    mockExportCSVAction.mockResolvedValue(mockResult);

    render(<SelectedItemsFlyout />);

    const downloadButton = screen.getByText('Download');
    await fireEvent.click(downloadButton);

    expect(mockExportCSVAction).toHaveBeenCalledWith(
      mockSelectedItems,
      '1_pokemon_export.csv'
    );
  });

  it('should handle CSV download with success but no data', async () => {
    const mockResult = {
      success: true,
      data: '',
      filename: '1_pokemon_export.csv',
    };

    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });
    mockExportCSVAction.mockResolvedValue(mockResult);

    render(<SelectedItemsFlyout />);

    const downloadButton = screen.getByText('Download');
    await fireEvent.click(downloadButton);

    expect(mockExportCSVAction).toHaveBeenCalledWith(
      mockSelectedItems,
      '1_pokemon_export.csv'
    );
  });

  it('should handle CSV download failure', async () => {
    const mockResult = {
      success: false,
      data: '',
      filename: '',
    };

    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });
    mockExportCSVAction.mockResolvedValue(mockResult);

    render(<SelectedItemsFlyout />);

    const downloadButton = screen.getByText('Download');
    await fireEvent.click(downloadButton);

    expect(mockExportCSVAction).toHaveBeenCalledWith(
      mockSelectedItems,
      '1_pokemon_export.csv'
    );
  });

  it('should handle CSV download error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });
    mockExportCSVAction.mockRejectedValue(new Error('Network error'));

    render(<SelectedItemsFlyout />);

    const downloadButton = screen.getByText('Download');
    await fireEvent.click(downloadButton);

    expect(mockExportCSVAction).toHaveBeenCalledWith(
      mockSelectedItems,
      '1_pokemon_export.csv'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error exporting CSV:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should call clearAll when clear button is clicked', () => {
    mockGetSelectedCount.mockReturnValue(1);
    mockUseSelectedItemsStore.mockReturnValue({
      selectedItems: mockSelectedItems,
      clearAll: mockClearAll,
      getSelectedCount: mockGetSelectedCount,
    });

    render(<SelectedItemsFlyout />);

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    expect(mockClearAll).toHaveBeenCalledTimes(1);
  });
});
