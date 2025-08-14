import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';
import type { PokemonDetails } from '@api/pokeapi';
import { useSelectedItemsStore } from '@store/selectedItemsStore';

vi.mock('@store/selectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn(),
}));

const mockUseSelectedItemsStore = vi.mocked(useSelectedItemsStore);

describe('Card component', () => {
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

  beforeEach(() => {
    mockUseSelectedItemsStore.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      isSelected: () => false,
    });
  });

  it('renders name, type, and image correctly', () => {
    render(<Card pokemon={mockPokemon} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    const image = screen.getByAltText(/pikachu/i);
    expect(image).toHaveAttribute('src');
    expect(image.getAttribute('src')).toContain('pikachu.png');
  });

  it('renders safely when some props are missing', () => {
    const incompletePokemon = {
      name: 'unknown',
      sprites: { front_default: 'https://example.com/placeholder.png' }, // Provide valid URL instead of null
      types: [],
      height: 0,
      abilities: [],
      forms: [],
      moves: [],
    } as unknown as PokemonDetails;

    render(<Card pokemon={incompletePokemon} />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
    expect(screen.getByText(/type:/i)).toBeInTheDocument(); // empty but doesn't break
  });

  it('uses the name as alt text for image (accessibility)', () => {
    render(<Card pokemon={mockPokemon} />);
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image.alt).toBe('pikachu');
  });

  it('renders checkbox for item selection', () => {
    render(<Card pokemon={mockPokemon} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('shows checkbox as checked when item is selected', () => {
    mockUseSelectedItemsStore.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      isSelected: () => true,
    });

    render(<Card pokemon={mockPokemon} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls addItem when checkbox is checked', () => {
    const mockAddItem = vi.fn();
    mockUseSelectedItemsStore.mockReturnValue({
      addItem: mockAddItem,
      removeItem: vi.fn(),
      isSelected: () => false,
    });

    render(<Card pokemon={mockPokemon} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockAddItem).toHaveBeenCalledWith(mockPokemon);
  });

  it('calls removeItem when checkbox is unchecked', () => {
    const mockRemoveItem = vi.fn();
    mockUseSelectedItemsStore.mockReturnValue({
      addItem: vi.fn(),
      removeItem: mockRemoveItem,
      isSelected: () => true,
    });

    render(<Card pokemon={mockPokemon} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockRemoveItem).toHaveBeenCalledWith('pikachu');
  });
});
