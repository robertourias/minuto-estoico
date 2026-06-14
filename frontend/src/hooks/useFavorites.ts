'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quote } from '@/types/quote';

const STORAGE_KEY = 'minuto-estoico:favorites';

export function useFavorites() {
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

  const saveFavorites = useCallback((updated: Quote[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignora erros de escrita (storage cheio etc.)
    }
  }, []);

  const addFavorite = useCallback(
    (quote: Quote) => {
      const exists = favorites.some((f) => f.id === quote.id);
      if (!exists) {
        saveFavorites([...favorites, quote]);
      }
    },
    [favorites, saveFavorites],
  );

  const removeFavorite = useCallback(
    (quoteId: string) => {
      saveFavorites(favorites.filter((f) => f.id !== quoteId));
    },
    [favorites, saveFavorites],
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

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
