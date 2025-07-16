import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from '../App';
import type { PokemonDetails } from '../api/pokeapi';
import * as api from '../api/pokeapi';
import { type Component } from 'react';

// Limpia el localStorage y mocks antes de cada test
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
  };
  const mockPokemonList = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ];
  it('renders the title and search bar', () => {
    render(<App />);
    expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
  });

  it('loads default list on mount if no search term in localStorage', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue(mockPokemonList);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(<App />);

    expect(screen.getByText(/pokémon search/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/name: pikachu/i)).toBeInTheDocument();
    });
  });

  it('loads from localStorage if searchTerm is saved', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/name: pikachu/i)).toBeInTheDocument();
    });
  });

// it('Shows the Spinner when AppState loading is true', () => {
//   const { container } = render(<App />);

//   act(() => {
//     // Accedemos al componente y forzamos el estado
//     const instance = (container.firstChild as any)._reactRootContainer._internalRoot.current.child.stateNode;
//     instance.setState({ loading: true });
//   });

//   // Verifica que el spinner (clase animate-spin) esté en el documento
//   expect(container.querySelector('animate-spin')).toBeInTheDocument();
// });

  it('updates state correctly on successful search', async () => {
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue(mockPokemon);

    render(<App />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/name: pikachu/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('handles API error on search gracefully', async () => {
    vi.spyOn(api, 'fetchPokemonByName').mockRejectedValue(new Error('404'));

    render(<App />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'missingno' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/no se encontró ningún pokémon llamado/i)
      ).toBeInTheDocument();
    });
  });

  //   const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  //   render(<App />);
  //   const button = screen.getByText(/Lanzar error/i);

  //   fireEvent.click(button);

  //   expect(errorSpy).toHaveBeenCalled();

  //   errorSpy.mockRestore();
  // });
});
