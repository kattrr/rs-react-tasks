import { render, screen } from '@testing-library/react';
import CardList from '../CardList';
import type { PokemonDetails } from '../../api/pokeapi';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../Card', () => ({
  default: ({ pokemon }: { pokemon: PokemonDetails }) => (
    <div data-testid="mock-card">{pokemon.name}</div>
  ),
}));

describe('CardList component', () => {
  it('renders correct number of items when data is provided', () => {
    const mockData: PokemonDetails[] = [
      { name: 'bulbasaur', sprites: { front_default: '' }, types: [] },
      { name: 'charmander', sprites: { front_default: '' }, types: [] },
    ];

    render(<CardList key={mockData.values.name} pokemons={mockData} />);
    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('bulbasaur');
    expect(cards[1]).toHaveTextContent('charmander');
  });

  it('renders no items when pokemons prop is empty', () => {
    render(<CardList pokemons={[]} />);
    const cards = screen.queryAllByTestId('mock-card');
    expect(cards).toHaveLength(0);
  });

  it('handles missing or undefined props gracefully', () => {
    const mockData: any = [
      { name: undefined, id: null, sprites: null, types: null },
    ];

    render(<CardList pokemons={mockData} />);
    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('');
  });
});
