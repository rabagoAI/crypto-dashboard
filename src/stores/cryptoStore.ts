import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CryptoStore {
  favorites: string[];
  darkMode: boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleDarkMode: () => void;
}

export const useCryptoStore = create<CryptoStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      darkMode: false,
      
      addFavorite: (id: string) =>
        set((state) => ({ 
          favorites: [...state.favorites, id] 
        })),
      
      removeFavorite: (id: string) =>
        set((state) => ({ 
          favorites: state.favorites.filter(fav => fav !== id) 
        })),
      
      isFavorite: (id: string) => 
        get().favorites.includes(id),
      
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'crypto-storage',
    }
  )
);