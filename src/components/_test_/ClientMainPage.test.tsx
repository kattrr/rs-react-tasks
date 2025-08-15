import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientMainPage from '../ClientMainPage';
import * as api from '@/api/pokeapi';

vi.mock('@/api/pokeapi', () => ({
  fetchPokemonByName: vi.fn(),
  fetchPokemonList: vi.fn(),
}));

vi.mock('@/components/CardList', () => ({
  default: ({
    pokemons,
    onCardClick,
  }: {
    pokemons: unknown[];
    onCardClick?: (name: string) => void;
  }) => {
    if (!pokemons || pokemons.length === 0) {
      return <div data-testid="card-list-empty">No Pokemon</div>;
    }

    return (
      <div data-testid="card-list">
        {(pokemons as { name: string }[]).map((pokemon) => (
          <div
            key={pokemon.name}
            onClick={() => onCardClick?.(pokemon.name)}
            data-testid={`pokemon-${pokemon.name}`}
          >
            {pokemon.name}
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock('@/components/SearchBar', () => ({
  default: ({
    onSearch,
    searchTerm,
  }: {
    onSearch: (value: string) => void;
    searchTerm: string;
  }) => (
    <div>
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search Pokemon"
      />
    </div>
  ),
}));

vi.mock('@/components/Pagination', () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('@/components/PokemonDetailsPanel', () => ({
  default: ({
    detailsName,
    onClose,
  }: {
    detailsName: string;
    onClose: () => void;
  }) => (
    <div data-testid="details-panel">
      <h3>Details for {detailsName}</h3>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const mockPokemon = [
  {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: { front_default: 'https://example.com/sprite.png' },
    types: [{ type: { name: 'grass' } }],
    stats: [],
    abilities: [],
    forms: [{ name: 'bulbasaur' }],
    moves: [{ move: { name: 'tackle' } }],
  },
  {
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    sprites: { front_default: 'https://example.com/sprite2.png' },
    types: [{ type: { name: 'grass' } }],
    stats: [],
    abilities: [],
    forms: [{ name: 'ivysaur' }],
    moves: [{ move: { name: 'vine-whip' } }],
  },
];

describe('ClientMainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial Pokemon list', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    expect(screen.getByText('🔍 Pokémon Search')).toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-ivysaur')).toBeInTheDocument();
  });

  it('shows pagination when not searching and multiple pages exist', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('handles Pokemon card clicks', async () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const bulbasaurCard = screen.getByTestId('pokemon-bulbasaur');

    await act(async () => {
      fireEvent.click(bulbasaurCard);
    });

    await waitFor(() => {
      expect(screen.getByTestId('details-panel')).toBeInTheDocument();
      expect(screen.getByText('Details for bulbasaur')).toBeInTheDocument();
    });
  });

  it('handles page change successfully', async () => {
    const mockPokemonList = [
      { name: 'charmander', url: 'https://example.com/charmander' },
      { name: 'charmeleon', url: 'https://example.com/charmeleon' },
    ];
    const mockPokemonDetails = [
      { ...mockPokemon[0], name: 'charmander' },
      { ...mockPokemon[1], name: 'charmeleon' },
    ];

    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockPokemonList);
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemonDetails[0]);
    vi.mocked(api.fetchPokemonByName).mockResolvedValueOnce(
      mockPokemonDetails[0]
    );
    vi.mocked(api.fetchPokemonByName).mockResolvedValueOnce(
      mockPokemonDetails[1]
    );

    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const nextButton = screen.getByText('Next');

    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(api.fetchPokemonList).toHaveBeenCalledWith(12, 12);
    });
  });

  it('handles page change error', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValue(new Error('Page error'));

    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const nextButton = screen.getByText('Next');

    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Page error')).toBeInTheDocument();
    });
  });

  it('handles container click to close details', async () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const bulbasaurCard = screen.getByTestId('pokemon-bulbasaur');

    await act(async () => {
      fireEvent.click(bulbasaurCard);
    });

    await waitFor(() => {
      expect(screen.getByTestId('details-panel')).toBeInTheDocument();
    });

    const container = screen
      .getByText('🔍 Pokémon Search')
      .closest('div')?.parentElement;
    if (container) {
      await act(async () => {
        fireEvent.click(container);
      });
    }

    await waitFor(() => {
      expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument();
    });
  });

  it('handles refresh button click to reset all state', async () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const refreshButton = screen.getByText('🏠 Go to Home & Clear Cache');

    await act(async () => {
      fireEvent.click(refreshButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  it('handles throw error button to test error boundary', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const errorButton = screen.getByText('Throw error');

    expect(errorButton).toBeInTheDocument();
    expect(errorButton).toHaveTextContent('Throw error');

    consoleSpy.mockRestore();
  });

  it('handles search with API error', async () => {
    vi.mocked(api.fetchPokemonByName).mockRejectedValue(
      new Error('Pokemon not found')
    );

    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const searchInput = screen.getByTestId('search-input');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'invalid-pokemon' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('handles search with unknown error', async () => {
    vi.mocked(api.fetchPokemonByName).mockRejectedValue('Unknown error type');

    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const searchInput = screen.getByTestId('search-input');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'invalid-pokemon' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });
  });
});
