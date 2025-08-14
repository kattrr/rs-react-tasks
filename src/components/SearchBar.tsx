'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm?: string;
}

const SearchBar = ({
  onSearch,
  searchTerm: propSearchTerm = '',
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(propSearchTerm);
  const t = useTranslations();

  // Sync input value when propSearchTerm changes
  useEffect(() => {
    setInputValue(propSearchTerm);
  }, [propSearchTerm]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Automatically search when input is cleared or changed
    if (value === '') {
      onSearch(''); // Clear search
    }
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
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
        className={twMerge(
          'bg-white/10 flex-grow',
          'py-2 pl-4 mr-4 rounded-2xl',
          'text-base text-black placeholder:text-gray-400',
          'border border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-400'
        )}
        placeholder={t('pokemon.noResults')}
      />
      <button
        onClick={handleSearch}
        className={twMerge(
          'bg-[#1a1a1a] cursor-pointer transition-colors duration-200',
          'px-[1.2em] py-[0.6em] rounded-lg',
          'text-base font-medium font-inherit text-white',
          'border border-transparent hover:border-[#646cff]',
          'focus:outline-4 focus:outline-blue-400'
        )}
      >
        {t('common.search')}
      </button>
    </div>
  );
};

export default SearchBar;
