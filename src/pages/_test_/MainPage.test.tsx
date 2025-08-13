import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, useSearchParams } from 'react-router';
import MainPage from '../MainPage';
import type { PokemonDetails } from '@api/pokeapi';

// Mock useSearchParams
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

// Mock the components
vi.mock('../../components', () => ({
  SearchBar: ({ onSearch }: { onSearch: (term: string) => void }) => (
    <div data-testid="search-bar">
      <input
        placeholder="Search Pokémon..."
        onChange={(e) => onSearch(e.target.value)}
        data-testid="search-input"
      />
    </div>
  ),
  CardList: ({
    pokemons,
    onCardClick,
  }: {
    pokemons: PokemonDetails[];
    onCardClick: (name: string) => void;
  }) => (
    <div data-testid="card-list">
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.name}
          onClick={() => onCardClick(pokemon.name)}
          data-testid={`pokemon-card-${pokemon.name}`}
        >
          {pokemon.name}
        </div>
      ))}
    </div>
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../components/Pagination', () => ({
  default: ({
    currentPage,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        data-testid="prev-page"
      >
        Previous
      </button>
      <span data-testid="current-page">{currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        data-testid="next-page"
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock('../../components/PokemonDetailsPanel', () => ({
  default: ({
    detailsName,
    onClose,
  }: {
    detailsName: string;
    onClose: () => void;
  }) => (
    <div data-testid="details-panel">
      <span data-testid="details-name">{detailsName}</span>
      <button onClick={onClose} data-testid="close-details">
        Close
      </button>
    </div>
  ),
}));

describe('MainPage', () => {
  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    types: [{ type: { name: 'electric' } }],
    height: 4,
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name: 'pikachu' }],
    moves: [{ move: { name: 'thunder-shock' } }],
  };

  const defaultProps = {
    pokemons: [mockPokemon],
    loading: false,
    error: null,
    searchTerm: '',
    currentPage: 1,
    totalPages: 10,
    onSearch: vi.fn(),
    onPageChange: vi.fn(),
    onThrowError: vi.fn(),
    onRefresh: vi.fn(),
  };

  const renderMainPage = (props = {}) => {
    return render(
      <BrowserRouter>
        <MainPage {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSetSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(''),
      mockSetSearchParams,
    ]);
  });

  it('renders the main page title', () => {
    renderMainPage();
    expect(screen.getByText('🔍 Pokémon Search')).toBeInTheDocument();
  });

  it('handles card click to open details panel', async () => {
    const mockSetSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(''),
      mockSetSearchParams,
    ]);

    renderMainPage();
    const card = screen.getByTestId('pokemon-card-pikachu');

    act(() => {
      fireEvent.click(card);
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '1',
      details: 'pikachu',
    });
  });

  it('shows details panel when detailsName is in URL', () => {
    const mockSetSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('?details=pikachu'),
      mockSetSearchParams,
    ]);

    renderMainPage();

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
    expect(screen.getByTestId('details-name')).toHaveTextContent('pikachu');
  });

  it('handles closing details panel', () => {
    const mockSetSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('?details=pikachu'),
      mockSetSearchParams,
    ]);

    renderMainPage();

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-details');
    fireEvent.click(closeButton);

    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
  });

  it('does not show details panel when detailsName is not in URL', () => {
    const mockSetSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(''),
      mockSetSearchParams,
    ]);

    renderMainPage();

    expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument();
  });
});
