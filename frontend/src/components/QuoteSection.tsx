'use client';

import { useState, useCallback } from 'react';
import { Quote } from '@/types/quote';
import { QuoteCard } from './QuoteCard';
import { getRandomQuote } from '@/lib/api';

interface QuoteSectionProps {
  initialQuote: Quote;
}

export function QuoteSection({ initialQuote }: QuoteSectionProps) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [isLoading, setIsLoading] = useState(false);
  const [isDaily, setIsDaily] = useState(true);

  const handleNewQuote = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newQuote = await getRandomQuote(quote.id);
      setQuote(newQuote);
      setIsDaily(false);
    } catch (err) {
      console.error('Erro ao buscar nova citação:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quote.id, isLoading]);

  const handleSelectFavorite = useCallback((selected: Quote) => {
    setQuote(selected);
    setIsDaily(false);
  }, []);

  return (
    <QuoteCard
      quote={quote}
      onNewQuote={handleNewQuote}
      isLoading={isLoading}
    />
  );
}
