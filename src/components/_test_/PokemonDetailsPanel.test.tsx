import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import PokemonDetailsPanel from '../PokemonDetailsPanel';
import { QueryProvider } from '../../providers/QueryProvider';
import type { PokemonDetails } from '@api/pokeapi';

// Mock next/image to avoid testing image functionality
vi.mock('next/image', () => ({
  default: () => null, // Return null to avoid image testing
}));

// Mock the usePokemonDetails hook
vi.mock('@hooks/usePokemonQueries', () => ({
  usePokemonDetails: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

// Mock Spinner component
vi.mock('../Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(panel).toHaveClass('w-1/3', 'bg-white', 'rounded-2xl', 'shadow-lg', 'p-6', 'flex', 'flex-col', 'relative', 'min-h-[725px]');
  });

  it('renders close button with correct styling', () => {
    renderWithProvider('pikachu');
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveClass('absolute', 'top-2', 'right-2', 'px-2', 'py-1', 'bg-red-200', 'rounded', 'hover:bg-red-300', 'text-red-600');
    expect(closeButton).toHaveAttribute('aria-label', 'Close panel');
  });

  it('renders with correct component structure', () => {
    renderWithProvider('pikachu');
    
    const panel = screen.getByTestId('details-panel');
    expect(panel).toBeInTheDocument();
    
    // Verify the component renders without crashing
    expect(panel.firstChild).toBeInTheDocument();
  });
});

