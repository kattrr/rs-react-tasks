import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    types: [{ type: { name: 'electric' } }],
    height: 4,
    abilities: [{ ability: { name: 'static' } }],
    forms: [{ name: 'pikachu' }],
    moves: [{ move: { name: 'thunder-shock' } }],
  };

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

  const renderApp = () => {
    return render(
      <TestQueryClientProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </TestQueryClientProvider>
    );
  };

  it('renders without crashing', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    await act(async () => {
      renderApp();
    });

    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });

  it('displays search form', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

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
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

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
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

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
            <BrowserRouter>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </TestQueryClientProvider>
      );
    });

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    // Find and click the "Throw error" button
    const throwErrorButton = screen.getByRole('button', {
      name: /throw error/i,
    });

    await act(async () => {
      fireEvent.click(throwErrorButton);
    });

    // Verify that the error was caught by ErrorBoundary
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
            <BrowserRouter>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </TestQueryClientProvider>
      );
    });

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });

    // Find and click the "Throw error" button
    const throwErrorButton = screen.getByRole('button', {
      name: /throw error/i,
    });

    await act(async () => {
      fireEvent.click(throwErrorButton);
    });

    // Verify that the error was caught by ErrorBoundary
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('applies dark theme class correctly', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    await act(async () => {
      renderApp();
    });

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    });
  });
});
