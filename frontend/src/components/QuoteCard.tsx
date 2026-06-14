'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Heart, RefreshCw, Share2, Check } from 'lucide-react';
import { Quote } from '@/types/quote';
import { copyToClipboard, buildShareText, buildWhatsAppUrl } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

interface QuoteCardProps {
  quote: Quote;
  onNewQuote: () => void;
  isLoading?: boolean;
}

export function QuoteCard({ quote, onNewQuote, isLoading = false }: QuoteCardProps) {
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(quote.id);

  const handleCopy = useCallback(async () => {
    const text = buildShareText(quote);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [quote]);

  const handleWhatsApp = useCallback(() => {
    const text = buildShareText(quote);
    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  }, [quote]);

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={quote.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-2xl mx-auto"
        aria-label={`Citação de ${quote.author}`}
      >
        {/* Categoria */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <span className="category-badge">{quote.category}</span>
        </motion.div>

        {/* Ornamento decorativo */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-parchment-300 dark:bg-stone-700" />
          <div className="text-parchment-400 text-lg select-none">❧</div>
          <div className="h-px w-12 bg-parchment-300 dark:bg-stone-700" />
        </motion.div>

        {/* Frase */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="quote-text text-center mb-6 px-4"
        >
          <span className="text-parchment-400 dark:text-stone-700 text-5xl leading-none select-none">"</span>
          {quote.text}
          <span className="text-parchment-400 dark:text-stone-700 text-5xl leading-none select-none">"</span>
        </motion.blockquote>

        {/* Autor */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="author-text text-center mb-10"
        >
          — {quote.author}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="h-px bg-parchment-200 dark:bg-stone-700 mb-8"
        />

        {/* Reflexão */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="reflection-text text-center mb-10"
        >
          {quote.reflection}
        </motion.p>

        {/* Tags */}
        {quote.tags && quote.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {quote.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-stone-400 dark:text-stone-500 border border-parchment-300 dark:border-stone-700 rounded-full px-3 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          {/* Botão principal: Nova Reflexão */}
          <button
            onClick={onNewQuote}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium
              bg-stone-800 text-parchment-50 transition-all duration-200
              hover:bg-stone-700 hover:shadow-md active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed
              dark:bg-parchment-100 dark:text-stone-900 dark:hover:bg-parchment-200
            `}
          >
            <RefreshCw
              size={16}
              className={isLoading ? 'animate-spin' : ''}
            />
            {isLoading ? 'Carregando...' : 'Nova reflexão'}
          </button>

          {/* Favoritar */}
          <button
            onClick={() => toggleFavorite(quote)}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`
              p-3 rounded-full border transition-all duration-200 active:scale-95
              ${isFav
                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
                : 'border-parchment-300 text-stone-400 hover:border-rose-200 hover:text-rose-400 dark:border-stone-700 dark:text-stone-500 dark:hover:border-rose-800 dark:hover:text-rose-400'}
            `}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>

          {/* Copiar */}
          <button
            onClick={handleCopy}
            title="Copiar reflexão"
            className={`
              p-3 rounded-full border transition-all duration-200 active:scale-95
              ${copied
                ? 'bg-green-50 border-green-200 text-green-500 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
                : 'border-parchment-300 text-stone-400 hover:border-stone-300 hover:text-stone-600 dark:border-stone-700 dark:text-stone-500 dark:hover:border-stone-600 dark:hover:text-stone-300'}
            `}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>

          {/* Compartilhar WhatsApp */}
          <button
            onClick={handleWhatsApp}
            title="Compartilhar no WhatsApp"
            className="p-3 rounded-full border border-parchment-300 dark:border-stone-700 text-stone-400 dark:text-stone-500
                       hover:border-green-300 hover:text-green-500 dark:hover:border-green-800 dark:hover:text-green-400 transition-all duration-200 active:scale-95"
          >
            <Share2 size={18} />
          </button>
        </motion.div>
      </motion.article>
    </AnimatePresence>
  );
}
