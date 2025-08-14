import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientMainPage from '../ClientMainPage';

// Mock the API functions
vi.mock('@/api/pokeapi', () => ({
  fetchPokemonByName: vi.fn(),
  fetchPokemonList: vi.fn(),
}));

// Mock the components
vi.mock('@/components/CardList', () => ({
  default: ({
    pokemons,
    onCardClick,
  }: {
    pokemons: unknown[];
    onCardClick?: (name: string) => void;
  }) => (
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
  ),
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

  it('shows pagination when not searching', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });

    expect(searchInput).toHaveValue('pikachu');
  });

  it('handles Pokemon card clicks', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const bulbasaurCard = screen.getByTestId('pokemon-bulbasaur');
    fireEvent.click(bulbasaurCard);

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
    expect(screen.getByText('Details for bulbasaur')).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    render(<ClientMainPage initialPokemonList={mockPokemon} />);

    const refreshButton = screen.getByText('🏠 Go to Home & Clear Cache');
    fireEvent.click(refreshButton);

    // Should still show the initial Pokemon list
    expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
  });
});
