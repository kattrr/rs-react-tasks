import { useState } from 'react';

/**
 * Custom hook para sincronizar un valor string con localStorage.
 * @param key Clave de localStorage
 * @param initialValue Valor inicial si no existe en localStorage
 */
export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : initialValue;
  });

  const setAndStore = (newValue: string) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, setAndStore] as const;
}
