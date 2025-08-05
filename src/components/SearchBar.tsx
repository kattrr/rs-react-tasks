import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState, useEffect } from 'react';
import { useSearchTerm } from '@hooks/useSearchTerm';

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm?: string;
}

const SearchBar = ({
  onSearch,
  searchTerm: propSearchTerm,
}: SearchBarProps) => {
  const {
    searchTerm: hookSearchTerm,
    updateSearchTerm,
    clearSearchTerm,
  } = useSearchTerm();
  const [inputValue, setInputValue] = useState('');

  // Use prop searchTerm if provided, otherwise use hook searchTerm
  const searchTerm =
    propSearchTerm !== undefined ? propSearchTerm : hookSearchTerm;

  // Update input value when searchTerm changes externally
  useEffect(() => {
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      clearSearchTerm();
      onSearch('');
    } else {
      updateSearchTerm(value);
    }
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      clearSearchTerm();
      onSearch('');
      return;
    }
    updateSearchTerm(trimmed);
    onSearch(trimmed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full justify-between gap-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="bg-white/10 py-2 pl-4 rounded-2xl flex-grow mr-4 text-base text-black placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search Pokémon..."
      />
      <button
        onClick={handleSearch}
        className="rounded-lg border border-transparent px-[1.2em] py-[0.6em] text-base font-medium font-inherit bg-[#1a1a1a] text-white cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-blue-400"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
