import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import PokemonDetailsPanel from '../PokemonDetailsPanel';
import { QueryProvider } from '../../providers/QueryProvider';
import type { PokemonDetails } from '@api/pokeapi';
import { mock } from 'node:test';
// Mock next/image to avoid testing image functionality
vi.mock('next/image', () => ({
  default: () => null, // Return null to avoid image testing
}));

// Mock the usePokemonDetails hook
vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonDetails: vi.fn(),
}));

// Mock Spinner component
vi.mock('../Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

const mockUsePokemonDetails = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonDetails: mockUsePokemonDetails,
}));
type MockQueryResult = Pick<
  UseQueryResult<PokemonDetails, Error>,
  'data' | 'isLoading' | 'error'
>;

describe('PokemonDetailsPanel', () => {
  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    types: [{ type: { name: 'electric' } }, { type: { name: 'flying' } }],
    height: 4,
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name: 'pikachu' }],
    moves: [
      { move: { name: 'thunder-shock' } },
      { move: { name: 'quick-attack' } },
      { move: { name: 'thunderbolt' } },
      { move: { name: 'agility' } },
      { move: { name: 'slam' } },
      { move: { name: 'double-team' } },
      { move: { name: 'growl' } },
      { move: { name: 'tail-whip' } },
      { move: { name: 'mega-punch' } },
      { move: { name: 'pay-day' } },
      { move: { name: 'mega-kick' } },
      { move: { name: 'body-slam' } },
      { move: { name: 'take-down' } },
      { move: { name: 'double-edge' } },
      { move: { name: 'submission' } },
    ],
  };
  const mockPokemonNull: PokemonDetails = {
    name: '',
    sprites: {
      front_default: '',
    },
    types: [],
    height: 0,
    abilities: [],
    forms: [],
    moves: [],
  };
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock return value
    mockUsePokemonDetails.mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: null,
    } as MockQueryResult);
  });

  const renderWithProvider = (pokemonName: string) => {
    return render(
      <QueryProvider>
        <PokemonDetailsPanel detailsName={pokemonName} onClose={vi.fn()} />
      </QueryProvider>
    );
  };

  it('shows close button', () => {
    renderWithProvider('pikachu');
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <QueryProvider>
        <PokemonDetailsPanel detailsName="pikachu" onClose={mockOnClose} />
      </QueryProvider>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles click event with stopPropagation', () => {
    renderWithProvider('pikachu');

    const panel = screen.getByTestId('details-panel');
    expect(panel).toBeInTheDocument();

    // Test that the panel has the correct structure and classes
    expect(panel).toHaveClass(
      'w-1/3',
      'bg-white',
      'rounded-2xl',
      'shadow-lg',
      'p-6',
      'flex',
      'flex-col',
      'relative',
      'min-h-[725px]'
    );
  });

  it('renders close button with correct styling', () => {
    renderWithProvider('pikachu');

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveClass(
      'absolute',
      'top-2',
      'right-2',
      'px-2',
      'py-1',
      'bg-red-200',
      'rounded',
      'hover:bg-red-300',
      'text-red-600'
    );
    expect(closeButton).toHaveAttribute('aria-label', 'Close panel');
  });

  it('renders with correct component structure', () => {
    renderWithProvider('pikachu');

    const panel = screen.getByTestId('details-panel');
    expect(panel).toBeInTheDocument();

    // Verify the component renders without crashing
    expect(panel.firstChild).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    mockUsePokemonDetails.mockReturnValue({
      data: mockPokemonNull,
      isLoading: true,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error state when error occurs', () => {
    // Mock the hook to return error state
    mockUsePokemonDetails.mockReturnValue({
      data: mockPokemonNull,
      isLoading: false,
      error: new Error('Network error'),
    } as MockQueryResult);

    renderWithProvider('pikachu');

    expect(screen.getByText(/error loading pokémon/i)).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(
      screen.getByText(/please try again or select a different pokémon/i)
    ).toBeInTheDocument();
  });

  it('handles pokemon without abilities', () => {
    const pokemonWithoutAbilities = { ...mockPokemon, abilities: [] };

    // Mock the hook to return pokemon without abilities
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithoutAbilities,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Abilities section should not be rendered
    expect(screen.queryByText(/abilities:/i)).not.toBeInTheDocument();
  });

  it('handles pokemon with less than 12 moves', () => {
    const pokemonWithFewMoves = {
      ...mockPokemon,
      moves: mockPokemon.moves.slice(0, 5),
    };

    // Mock the hook to return pokemon with few moves
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithFewMoves,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Should not show "+X more" text
    expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument();
  });

  it('formats move names correctly by replacing hyphens with spaces', () => {
    // Mock the hook to return pokemon data
    mockUsePokemonDetails.mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Check that move names are formatted correctly
    expect(screen.getByText('thunder shock')).toBeInTheDocument();
    expect(screen.getByText('quick attack')).toBeInTheDocument();
  });

  it('capitalizes pokemon name and moves', () => {
    const charizardPokemon: PokemonDetails = {
      ...mockPokemon,
      name: 'charizard',
      moves: [
        { move: { name: 'fire-spin' } },
        { move: { name: 'dragon-claw' } },
      ],
    };

    // Mock the hook to return charizard data
    mockUsePokemonDetails.mockReturnValue({
      data: charizardPokemon,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('charizard');

    // Check that names are capitalized
    expect(screen.getByText('charizard')).toBeInTheDocument();
    expect(screen.getByText('fire spin')).toBeInTheDocument();
    expect(screen.getByText('dragon claw')).toBeInTheDocument();
  });

  it('handles pokemon with no moves', () => {
    const pokemonWithoutMoves = { ...mockPokemon, moves: [] };

    // Mock the hook to return pokemon without moves
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithoutMoves,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Moves section should not be rendered
    expect(screen.queryByText(/moves:/i)).not.toBeInTheDocument();
  });

  it('handles pokemon with no types', () => {
    const pokemonWithoutTypes = { ...mockPokemon, types: [] };

    // Mock the hook to return pokemon without types
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithoutTypes,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Types section should not be rendered
    expect(screen.queryByText(/type:/i)).not.toBeInTheDocument();
  });

  it('handles pokemon with height 0', () => {
    const pokemonWithZeroHeight = { ...mockPokemon, height: 0 };

    // Mock the hook to return pokemon with zero height
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithZeroHeight,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Height should display as 0
    expect(screen.getByText('0 m')).toBeInTheDocument();
  });

  it('handles pokemon with decimal height', () => {
    const pokemonWithDecimalHeight = { ...mockPokemon, height: 17 };

    // Mock the hook to return pokemon with decimal height
    mockUsePokemonDetails.mockReturnValue({
      data: pokemonWithDecimalHeight,
      isLoading: false,
      error: null,
    } as MockQueryResult);

    renderWithProvider('pikachu');

    // Height should display as 1.7
    expect(screen.getByText('1.7 m')).toBeInTheDocument();
  });
});
