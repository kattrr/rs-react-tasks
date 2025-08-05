import { describe, expect, beforeEach, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('renders the search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('shows previously saved search term from localStorage on mount', () => {
    localStorage.setItem('searchTerm', 'pikachu');
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  test('shows empty input when no saved term exists', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toHaveValue('');
  });

  test('updates input value when the user types', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  test('calls onSearch when search button is clicked with valid term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: ' charmander  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('charmander');
    expect(mockOnSearch).toHaveBeenCalledWith('charmander');
  });

  test('calls onSearch with empty string when search button is clicked with empty term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onSearch when Enter key is pressed with valid term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  test('calls onSearch with empty string when Enter key is pressed with empty term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(localStorage.getItem('searchTerm')).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
