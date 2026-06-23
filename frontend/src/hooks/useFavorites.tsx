'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Quote } from '@/types/quote';

const STORAGE_KEY = 'minuto-estoico:favorites';

interface FavoritesContextValue {
  favorites: Quote[];
  isLoaded: boolean;
  addFavorite: (quote: Quote) => void;
  removeFavorite: (quoteId: string) => void;
  toggleFavorite: (quote: Quote) => void;
  isFavorite: (quoteId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega favoritos do LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // ignora erros de parse
    }
    setIsLoaded(true);
  }, []);

  const addFavorite = useCallback(
    (quote: Quote) => {
      setFavorites((current) => {
        if (current.some((f) => f.id === quote.id)) return current;
        const updated = [...current, quote];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignora erros de escrita (storage cheio etc.)
        }
        return updated;
      });
    },
    [],
  );

  const removeFavorite = useCallback(
    (quoteId: string) => {
      setFavorites((current) => {
        const updated = current.filter((f) => f.id !== quoteId);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignora erros de escrita (storage cheio etc.)
        }
        return updated;
      });
    },
    [],
  );

  const toggleFavorite = useCallback(
    (quote: Quote) => {
      const isFav = favorites.some((f) => f.id === quote.id);
      if (isFav) {
        removeFavorite(quote.id);
      } else {
        addFavorite(quote);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  const isFavorite = useCallback(
    (quoteId: string) => favorites.some((f) => f.id === quoteId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoaded, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return ctx;
}
