import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import type { PokemonDetails } from '../api/pokeapi';
import * as api from '../api/pokeapi';

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
  const mockPokemonList = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ];
  it('renders the title and search bar', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
  });

  it('loads default list on mount if no search term in localStorage', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('loads from localStorage if searchTerm is saved', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('updates state correctly on successful search', async () => {
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('handles API error on search gracefully', async () => {
    vi.spyOn(api, 'fetchPokemonByName').mockRejectedValue(new Error('404'));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'missingno' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/no pokémon found named/i)).toBeInTheDocument();
    });
  });

  // Tests for specific lines that need coverage
  it('handles API error when loading default list', async () => {
    // Test lines 55-57: catch block in loadDefaultList
    vi.spyOn(api, 'fetchPokemonList').mockRejectedValue(
      new Error('Network error')
    );

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error loading default Pokémon')
      ).toBeInTheDocument();
    });
  });

  it('loads default list when search term is empty', async () => {
    // Test lines 62-64: if (!term) in handleSearch
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    // Search with empty term
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('handles API error when searching for specific pokemon', async () => {
    // Test lines 79-80: catch block in handleSearch
    vi.spyOn(api, 'fetchPokemonByName').mockRejectedValue(
      new Error('Pokemon not found')
    );

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'nonexistent' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText('No Pokémon found named "nonexistent"')
      ).toBeInTheDocument();
    });
  });
});
