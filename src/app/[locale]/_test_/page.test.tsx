import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../page';

vi.mock('@/api/pokeapi', () => ({
  fetchPokemonList: vi.fn(() =>
    Promise.resolve([
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ])
  ),
  fetchPokemonByName: vi.fn((name: string) =>
    Promise.resolve({
      id: 1,
      name,
      height: 7,
      weight: 69,
      sprites: { front_default: 'https://example.com/sprite.png' },
      types: [{ type: { name: 'grass' } }],
      stats: [],
      abilities: [],
    })
  ),
}));

vi.mock('@/components/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('@/components/ClientMainPage', () => ({
  default: ({ initialPokemonList }: { initialPokemonList: unknown[] }) => (
    <div data-testid="client-main-page">
      {initialPokemonList.length} Pokemon loaded
    </div>
  ),
}));

describe('HomePage', () => {
  it('renders without crashing', async () => {
    const page = await HomePage();
    render(page);

    expect(screen.getByTestId('client-main-page')).toBeInTheDocument();
    expect(screen.getByText('2 Pokemon loaded')).toBeInTheDocument();
  });
});
