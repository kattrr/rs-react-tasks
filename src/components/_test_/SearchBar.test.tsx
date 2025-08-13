import { describe, expect, beforeEach, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('shows initial search term from props', () => {
    render(<SearchBar onSearch={mockOnSearch} searchTerm="pikachu" />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  test('shows empty input when no search term is provided', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toHaveValue('');
  });

  test('updates input value when the user types', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  test('calls onSearch when search button is clicked with trimmed term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: ' charmander  ' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('charmander');
  });

  test('does not call onSearch when search button is clicked with empty term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('calls onSearch when Enter key is pressed with trimmed term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);

    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  test('calls onSearch with empty string when Enter key is pressed with empty term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('disables search button when input value matches current search term', () => {
    render(<SearchBar onSearch={mockOnSearch} searchTerm="pikachu" />);
    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeDisabled();
  });

  test('enables search button when input value changes', () => {
    render(<SearchBar onSearch={mockOnSearch} searchTerm="pikachu" />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: 'raichu' } });
    expect(button).not.toBeDisabled();
  });
});
