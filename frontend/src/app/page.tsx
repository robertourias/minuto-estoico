import { Suspense } from 'react';
import { getDailyQuote } from '@/lib/api';
import { HomeClient } from '@/components/HomeClient';

// Força SSR — nunca gera estático (a citação muda por dia e a API não está disponível no build)
export const dynamic = 'force-dynamic';

// Busca a citação do dia no servidor (SSR)
async function Home() {
  try {
    const dailyQuote = await getDailyQuote();
    return <HomeClient initialQuote={dailyQuote} />;
  } catch {
    // Fallback quando a API não está disponível
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-2xl text-stone-600 mb-4">Minuto Estoico</h1>
        <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
          Não foi possível conectar à API. Verifique se o backend está rodando
          em <code className="text-stone-500">localhost:3021</code>.
        </p>
        <p className="text-xs text-stone-300 mt-8">
          Rode <code>npm run start:dev</code> na pasta{' '}
          <code>backend/</code> para iniciar.
        </p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="h-8 w-48 bg-parchment-200 rounded" />
            <div className="h-4 w-64 bg-parchment-100 rounded" />
            <div className="h-4 w-56 bg-parchment-100 rounded" />
          </div>
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}
