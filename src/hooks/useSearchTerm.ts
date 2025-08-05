import { useLocalStorage } from './useLocalStorage';

export const useSearchTerm = (initialValue = '') => {
  const [searchTerm, setSearchTerm] = useLocalStorage(
    'searchTerm',
    initialValue
  );

  const updateSearchTerm = (value: string) => {
    const trimmed = value.trim();
    setSearchTerm(trimmed);
    return trimmed;
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    updateSearchTerm,
    clearSearchTerm,
  };
};
