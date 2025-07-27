import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';
import type { PokemonDetails } from '../../api/pokeapi';

describe('Card component', () => {
  const mockPokemon: PokemonDetails = {
    name: 'pikachu',
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    types: [{ type: { name: 'electric' } }],
  };

  it('renders name, type, and image correctly', () => {
    render(<Card pokemon={mockPokemon} />);
    expect(screen.getByText(/name: pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/type: electric/i)).toBeInTheDocument();
    expect(screen.getByAltText(/pikachu/i)).toHaveAttribute(
      'src',
      mockPokemon.sprites.front_default
    );
  });

  it('renders safely when some props are missing', () => {
    const incompletePokemon = {
      name: 'unknown',
      sprites: { front_default: '' },
      types: [],
    } as unknown as PokemonDetails;

    render(<Card pokemon={incompletePokemon} />);
    expect(screen.getByText(/name: unknown/i)).toBeInTheDocument();
    expect(screen.getByText(/type:/i)).toBeInTheDocument(); // vacío pero no rompe
  });

  it('uses the name as alt text for image (accessibility)', () => {
    render(<Card pokemon={mockPokemon} />);
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image.alt).toBe('pikachu');
  });
});
