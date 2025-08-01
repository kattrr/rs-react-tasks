import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PokemonDetails } from '../api/pokeapi';

interface SelectedItem {
  id: string;
  name: string;
  description: string;
  detailsUrl: string;
  imageUrl: string;
  types: string[];
}

interface SelectedItemsState {
  selectedItems: SelectedItem[];
  addItem: (pokemon: PokemonDetails) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
}

export const useSelectedItemsStore = create<SelectedItemsState>()(
  persist(
    (set, get) => ({
      selectedItems: [],

      addItem: (pokemon: PokemonDetails) => {
        const { selectedItems } = get();
        const item: SelectedItem = {
          id: pokemon.name,
          name: pokemon.name,
          description: `Type: ${pokemon.types.map((t) => t.type.name).join(', ')}`,
          detailsUrl: `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
          imageUrl: pokemon.sprites.front_default,
          types: pokemon.types.map((t) => t.type.name),
        };

        if (!selectedItems.find((item) => item.id === pokemon.name)) {
          set({ selectedItems: [...selectedItems, item] });
        }
      },

      removeItem: (id: string) => {
        const { selectedItems } = get();
        set({ selectedItems: selectedItems.filter((item) => item.id !== id) });
      },

      clearAll: () => {
        set({ selectedItems: [] });
      },

      isSelected: (id: string) => {
        const { selectedItems } = get();
        return selectedItems.some((item) => item.id === id);
      },

      getSelectedCount: () => {
        const { selectedItems } = get();
        return selectedItems.length;
      },
    }),
    {
      name: 'selected-items-storage',
      skipHydration: true, // Add this to fix test issues
    }
  )
);
