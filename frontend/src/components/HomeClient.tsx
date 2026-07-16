'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Quote } from '@/types/quote';
import { QuoteCard } from './QuoteCard';
import { ThemeToggle } from './ThemeToggle';
import { DailyBadge } from './DailyBadge';
import { getRandomQuote } from '@/lib/api';

interface HomeClientProps {
  initialQuote: Quote;
}

/**
 * Componente cliente raiz da home — gerencia o estado compartilhado
 * entre a exibição da citação atual e o drawer de favoritos.
 */
export function HomeClient({ initialQuote }: HomeClientProps) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewQuote = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newQuote = await getRandomQuote(quote.id);
      setQuote(newQuote);
    } catch (err) {
      console.error('Erro ao buscar nova citação:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quote.id, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 max-w-3xl mx-auto w-full">
        <div aria-hidden="true" />
        <div className="flex justify-center">
          <h1 className="m-0">
            <span className="sr-only">Minuto Estoico</span>
            <Image
              src="/logo.png"
              alt="Minuto Estoico"
              width={48}
              height={48}
              priority
              className="h-11 w-11 object-contain drop-shadow-sm"
            />
          </h1>
        </div>
        <nav className="flex items-center justify-end gap-6">
          <ThemeToggle />
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <DailyBadge />

          <div
            className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-2xl border border-parchment-200
                       dark:border-stone-700 shadow-sm shadow-stone-200/50 dark:shadow-none px-8 py-12 md:px-14 md:py-16"
          >
            <QuoteCard
              quote={quote}
              onNewQuote={handleNewQuote}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-6">
        <p className="text-xs text-stone-300 dark:text-stone-600">
          &ldquo;A filosofia é medicina da alma.&rdquo; — Cícero
        </p>
        <p className="text-xs text-stone-200 dark:text-stone-700 mt-1">
          Minuto Estoico · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
