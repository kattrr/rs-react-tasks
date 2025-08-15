import { render, screen } from '@testing-library/react';
import CardList from '../CardList';
import type { PokemonDetails } from '@api/pokeapi';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../Card', () => ({
  default: ({ pokemon }: { pokemon: PokemonDetails }) => (
    <div data-testid="mock-card">{pokemon.name}</div>
  ),
}));

describe('CardList component', () => {
  it('renders correct number of items when data is provided', () => {
    const mockData: PokemonDetails[] = [
      {
        name: 'bulbasaur',
        sprites: { front_default: '' },
        types: [],
        height: 7,
        abilities: [{ ability: { name: 'overgrow' } }],
        forms: [{ name: 'bulbasaur' }],
        moves: [{ move: { name: 'tackle' } }],
      },
      {
        name: 'charmander',
        sprites: { front_default: '' },
        types: [],
        height: 6,
        abilities: [{ ability: { name: 'blaze' } }],
        forms: [{ name: 'charmander' }],
        moves: [{ move: { name: 'scratch' } }],
      },
    ];

    render(<CardList pokemons={mockData} />);
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
    const mockData: PokemonDetails[] = [
      {
        name: '',
        sprites: { front_default: '' },
        types: [],
        height: 0,
        abilities: [],
        forms: [],
        moves: [],
      },
    ];

    render(<CardList pokemons={mockData} />);
    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('');
  });
  it('calls onCardClick when card is clicked', () => {
    const mockOnCardClick = vi.fn();
    const mockData: PokemonDetails[] = [
      {
        name: 'bulbasaur',
        sprites: { front_default: '' },
        types: [],
        height: 7,
        abilities: [{ ability: { name: 'overgrow' } }],
        forms: [{ name: 'bulbasaur' }],
        moves: [{ move: { name: 'tackle' } }],
      },
    ];
  
    render(<CardList pokemons={mockData} onCardClick={mockOnCardClick} />);
    
    const card = screen.getByTestId('mock-card');
    card.click();
    
    expect(mockOnCardClick).toHaveBeenCalledWith('bulbasaur');
  });
  
  it('applies cursor-pointer class when onCardClick is provided', () => {
    const mockOnCardClick = vi.fn();
    const mockData: PokemonDetails[] = [
      {
        name: 'bulbasaur',
        sprites: { front_default: '' },
        types: [],
        height: 7,
        abilities: [{ ability: { name: 'overgrow' } }],
        forms: [{ name: 'bulbasaur' }],
        moves: [{ move: { name: 'tackle' } }],
      },
    ];
  
    render(<CardList pokemons={mockData} onCardClick={mockOnCardClick} />);
    
    const cardContainer = screen.getByTestId('mock-card').parentElement;
    expect(cardContainer).toHaveClass('cursor-pointer');
  });

});
