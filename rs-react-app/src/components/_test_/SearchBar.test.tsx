import { describe, expect, beforeEach, vi, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the search input and button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('shows previously saved search term from localStorage on mount', () => {
    localStorage.setItem('searchTerm', 'pikachu');
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  test('shows empty input when no saved term exists', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toHaveValue('');
  });

  test('updates input value when the user types', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  test('saves search term to localStorage and calls onSearch', () => {
    const onSearchMock = vi.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText(/Search Pokémon/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: ' charmander  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('charmander');
    expect(onSearchMock).toHaveBeenCalledWith('charmander');
  });
});
