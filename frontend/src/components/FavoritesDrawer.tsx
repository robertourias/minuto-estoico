'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, BookOpen } from 'lucide-react';
import { Quote } from '@/types/quote';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesDrawerProps {
  onSelectQuote?: (quote: Quote) => void;
}

export function FavoritesDrawer({ onSelectQuote }: FavoritesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, removeFavorite, isLoaded } = useFavorites();

  return (
    <>
      {/* Botão de abertura */}
      <button
        onClick={() => setIsOpen(true)}
        title="Ver favoritos"
        className="relative flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500
                   hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
      >
        <Heart size={14} />
        <span>Favoritos</span>
        {isLoaded && favorites.length > 0 && (
          <span className="ml-0.5 bg-rose-100 dark:bg-rose-950 text-rose-500 dark:text-rose-300 text-[10px] font-medium
                           rounded-full px-1.5 py-0.5 leading-none">
            {favorites.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-parchment-50 dark:bg-stone-900
                         border-l border-parchment-200 dark:border-stone-700 z-50 overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-parchment-200 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-rose-400" fill="currentColor" />
                  <h2 className="font-medium text-stone-700 dark:text-stone-200">Favoritos</h2>
                  {favorites.length > 0 && (
                    <span className="text-xs text-stone-400 dark:text-stone-500">({favorites.length})</span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300
                             hover:bg-parchment-200 dark:hover:bg-stone-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen size={32} className="text-parchment-300 dark:text-stone-700 mb-4" />
                    <p className="text-stone-400 dark:text-stone-500 text-sm leading-relaxed">
                      Nenhuma reflexão favorita ainda.
                      <br />
                      Toque em ♡ para guardar as que tocarem seu coração.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {favorites.map((quote) => (
                      <li
                        key={quote.id}
                        className="p-4 rounded-xl border border-parchment-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60
                                   hover:border-parchment-300 dark:hover:border-stone-600 transition-colors group"
                      >
                        <button
                          onClick={() => {
                            onSelectQuote?.(quote);
                            setIsOpen(false);
                          }}
                          className="text-left w-full"
                        >
                          <p className="font-serif italic text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-2 line-clamp-3">
                            "{quote.text}"
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 tracking-wider uppercase">
                            — {quote.author}
                          </p>
                        </button>

                        <div className="flex justify-between items-center mt-3">
                          <span className="category-badge text-[10px]">{quote.category}</span>
                          <button
                            onClick={() => removeFavorite(quote.id)}
                            className="text-[11px] text-stone-300 dark:text-stone-600 hover:text-rose-400
                                       transition-colors duration-200"
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
