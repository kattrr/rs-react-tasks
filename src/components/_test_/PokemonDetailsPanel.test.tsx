import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router';
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

  const mockPokemonWithManyMoves = {
    ...mockPokemon,
    moves: Array.from({ length: 15 }, (_, i) => ({
      move: { name: `move-${i + 1}` },
    })),
  };

  const mockPokemonWithoutAbilities = {
    ...mockPokemon,
    abilities: [],
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
      expect(screen.getByText('electric, flying')).toBeInTheDocument();
      expect(screen.getByText('0.4 m')).toBeInTheDocument();
      expect(screen.getByText('static, lightning-rod')).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    vi.mocked(api.fetchPokemonByName).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      renderDetailsPanel();
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
      expect(
        screen.getByText('Please try again or select a different Pokémon')
      ).toBeInTheDocument();
    });
  });

  it('displays fallback image when sprite fails to load', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(mockPokemon);

    const { container } = await act(async () => {
      return renderDetailsPanel();
    });

    await waitFor(() => {
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    const img = container.querySelector('img');
    if (img) {
      // Simular error de carga de imagen
      fireEvent.error(img, {
        target: {
          src: 'https://example.com/pikachu.png',
        },
      });
    }

    await waitFor(() => {
      expect(img?.getAttribute('src')).toBe('/fallback-pokemon.png');
    });
  });

  it('displays "+X more" when there are more than 12 moves', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(
      mockPokemonWithManyMoves
    );

    await act(async () => {
      renderDetailsPanel();
    });

    await waitFor(() => {
      expect(screen.getByText('+3 more')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(13); // 12 moves + "+3 more"
  });

  it('does not render abilities section when abilities array is empty', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue(
      mockPokemonWithoutAbilities
    );

    await act(async () => {
      renderDetailsPanel();
    });

    await waitFor(() => {
      expect(screen.queryByText('Abilities')).not.toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching data', async () => {
    vi.mocked(api.fetchPokemonByName).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    await act(async () => {
      renderDetailsPanel();
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('capitalizes pokemon name and moves', async () => {
    vi.mocked(api.fetchPokemonByName).mockResolvedValue({
      ...mockPokemon,
      name: 'charizard',
      moves: [{ move: { name: 'fire-blast' } }],
      types: [{ type: { name: 'fire' } }],
      abilities: [{ ability: { name: 'blaze' } }],
    });

    await act(async () => {
      renderDetailsPanel({ detailsName: 'charizard' });
    });

    await waitFor(() => {
      // Verificar que el nombre está capitalizado visualmente
      const nameElement = screen.getByText('charizard');
      expect(nameElement).toHaveClass('capitalize');

      // Verificar que el movimiento está formateado
      expect(screen.getByText('fire blast')).toBeInTheDocument();
    });
  });
});
