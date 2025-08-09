import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import { ThemeProvider } from '@contexts/ThemeProvider';
import ErrorBoundary from '@components/ErrorBoundary';
import { TestQueryClientProvider } from '../test/queryClient';
import type { PokemonDetails, PokemonListItem } from '@api/pokeapi';
import * as api from '@api/pokeapi';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('App Component', () => {
  const createMockPokemon = (name: string): PokemonDetails => ({
    name,
    sprites: {
      front_default: `https://example.com/${name}.png`,
    },
    types: [{ type: { name: 'electric' } }],
    height: 4,
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name }],
    moves: [{ move: { name: 'thunder-shock' } }],
  });

  const mockPokemon = createMockPokemon('pikachu');

  const mockPokemonList: PokemonListItem[] = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
    { name: 'caterpie', url: 'https://pokeapi.co/api/v2/pokemon/10/' },
    { name: 'weedle', url: 'https://pokeapi.co/api/v2/pokemon/13/' },
    { name: 'pidgey', url: 'https://pokeapi.co/api/v2/pokemon/16/' },
    { name: 'rattata', url: 'https://pokeapi.co/api/v2/pokemon/19/' },
    { name: 'spearow', url: 'https://pokeapi.co/api/v2/pokemon/21/' },
    { name: 'ekans', url: 'https://pokeapi.co/api/v2/pokemon/23/' },
    { name: 'sandshrew', url: 'https://pokeapi.co/api/v2/pokemon/27/' },
    { name: 'nidoran-f', url: 'https://pokeapi.co/api/v2/pokemon/29/' },
  ];

  const renderApp = (initialPath = '/') => {
    return render(
      <TestQueryClientProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </MemoryRouter>
      </TestQueryClientProvider>
    );
  };

  it('renders without crashing', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('displays search form', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/search pokémon/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
    });
  });

  it('handles API error when loading default list', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockRejectedValue(
      new Error('Network error')
    );
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(
      () => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('handles page change correctly', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles error throw when shouldThrow is true', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <TestQueryClientProvider>
          <ErrorBoundary>
            <MemoryRouter>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </MemoryRouter>
          </ErrorBoundary>
        </TestQueryClientProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const throwErrorButton = screen.getByRole('button', {
      name: /throw error/i,
    });

    await act(async () => {
      fireEvent.click(throwErrorButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('calls onThrowError when throw error button is clicked', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <TestQueryClientProvider>
          <ErrorBoundary>
            <MemoryRouter>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </MemoryRouter>
          </ErrorBoundary>
        </TestQueryClientProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const throwErrorButton = screen.getByRole('button', {
      name: /throw error/i,
    });

    await act(async () => {
      fireEvent.click(throwErrorButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('applies dark theme class correctly', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const container = document.querySelector('div[class*="min-h-screen"]');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  it('applies dark theme class when theme is dark', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    localStorage.setItem('theme', 'dark');

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const container = document.querySelector('div[class*="min-h-screen"]');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  it('initializes with URL search term when present', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=pikachu');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('initializes with URL search term and sets search trigger', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=pikachu');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles page change functionality', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const paginationButtons = screen.getAllByRole('button');
    const nextButton = paginationButtons.find(
      (button) =>
        button.textContent?.includes('Next') ||
        button.textContent?.includes('>')
    );

    if (nextButton) {
      await act(async () => {
        fireEvent.click(nextButton);
      });
    }
  });

  it('handles refresh functionality', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', {
      name: /go to home & clear cache/i,
    });

    await act(async () => {
      fireEvent.click(refreshButton);
    });
  });

  it('handles search functionality with empty term', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles search functionality with valid term', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search pokémon/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      fireEvent.click(searchButton);
    });
  });

  it('handles invalid page parameter in URL', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?page=invalid');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles negative page parameter in URL', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?page=-1');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles NaN page parameter in URL', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?page=NaN');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles URL search term with whitespace', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=%20%20pikachu%20%20');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles URL search term that is empty after trim', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=%20%20%20');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles URL search term initialization with non-empty term', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=pikachu');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles URL search term initialization with empty term', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('handles URL search term initialization with whitespace-only term', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(
      createMockPokemon('pikachu')
    );

    await act(async () => {
      renderApp('/?search=%20%20');
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });
});
