import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';
import type { PokemonDetails } from '@api/pokeapi';
import { useSelectedItemsStore } from '@store/selectedItemsStore';

vi.mock('next/image', () => ({
  default: () => null,
}));

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

  it('renders name and type correctly', () => {
    render(<Card pokemon={mockPokemon} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('renders safely when some props are missing', () => {
    const incompletePokemon = {
      name: 'unknown',
      sprites: { front_default: 'https://example.com/placeholder.png' },
      types: [],
      height: 0,
      abilities: [],
      forms: [],
      moves: [],
    } as unknown as PokemonDetails;

    render(<Card pokemon={incompletePokemon} />);

    expect(screen.getByText('unknown')).toBeInTheDocument();
    expect(screen.getByText(/type:/i)).toBeInTheDocument();
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

  it('handles checkbox change with stopPropagation', () => {
    const mockAddItem = vi.fn();
    mockUseSelectedItemsStore.mockReturnValue({
      addItem: mockAddItem,
      removeItem: vi.fn(),
      isSelected: () => false,
    });

    render(<Card pokemon={mockPokemon} />);

    const checkbox = screen.getByRole('checkbox');

    const card = screen.getByText('pikachu').closest('div');
    expect(card).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(mockAddItem).toHaveBeenCalledWith(mockPokemon);
  });

  it('renders with correct CSS classes and structure', () => {
    const { container } = render(<Card pokemon={mockPokemon} />);

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass(
      'bg-white',
      'rounded-3xl',
      'flex',
      'flex-col',
      'items-center',
      'p-4',
      'shadow-md',
      'relative'
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'w-4',
      'h-4',
      'text-blue-600',
      'bg-gray-100',
      'border-gray-300',
      'rounded',
      'focus:ring-blue-500',
      'focus:ring-2'
    );

    const nameElement = screen.getByText('pikachu');
    expect(nameElement).toHaveClass('text-black', 'text-lg', 'font-semibold');

    expect(screen.getByText(/type:/i)).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();

    const typeSection = screen.getByText(/type:/i).closest('p');
    expect(typeSection).toHaveClass('text-black', 'text-base');
  });
});
