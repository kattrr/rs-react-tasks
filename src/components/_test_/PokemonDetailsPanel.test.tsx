import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PokemonDetailsPanel from '../PokemonDetailsPanel';
import { TestQueryClientProvider } from '../../test/queryClient';
import * as api from '@api/pokeapi';
import type { PokemonDetails } from '@api/pokeapi';

// Mock the API
vi.mock('../../api/pokeapi');

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
    abilities: [
      { ability: { name: 'static' } },
      { ability: { name: 'lightning-rod' } },
    ],
    forms: [{ name: 'pikachu' }, { name: 'pikachu-gmax' }],
    moves: [
      { move: { name: 'thunder-shock' } },
      { move: { name: 'quick-attack' } },
      { move: { name: 'thunderbolt' } },
      { move: { name: 'agility' } },
      { move: { name: 'slam' } },
      { move: { name: 'double-team' } },
      { move: { name: 'spark' } },
      { move: { name: 'thunder-wave' } },
      { move: { name: 'light-screen' } },
      { move: { name: 'thunder' } },
      { move: { name: 'extra-move' } },
    ],
  };

  const defaultProps = {
    detailsName: 'pikachu',
    onClose: vi.fn(),
  };

  const renderDetailsPanel = (props = {}) => {
    return render(
      <TestQueryClientProvider>
        <BrowserRouter>
          <PokemonDetailsPanel {...defaultProps} {...props} />
        </BrowserRouter>
      </TestQueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);
  });

  it('shows close button', async () => {
    await act(async () => {
      renderDetailsPanel();
    });

    const closeButton = screen.getByText('✕');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('absolute', 'top-2', 'right-2');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();

    await act(async () => {
      renderDetailsPanel({ onClose });
    });

    const closeButton = screen.getByText('✕');

    await act(async () => {
      closeButton.click();
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('fetches pokemon details on mount', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

    await act(async () => {
      renderDetailsPanel();
    });

    expect(api.fetchPokemonByName).toHaveBeenCalledWith('pikachu');
  });

  it('displays pokemon details when loaded successfully', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

    await act(async () => {
      renderDetailsPanel();
    });

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
      expect(screen.getByAltText('pikachu')).toHaveAttribute(
        'src',
        mockPokemon.sprites.front_default
      );
    });
  });

  it('shows error message when API call fails', async () => {
    vi.mocked(api.fetchPokemonByName).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      renderDetailsPanel();
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});
