import { Quote, QuoteListResponse } from '@/types/quote';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 0 }, // sem cache — sempre busca dados frescos
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** Busca a Citação do Dia (determinística por data) */
export async function getDailyQuote(): Promise<Quote> {
  return fetchApi<Quote>('/quotes/daily');
}

/** Busca uma citação aleatória, excluindo um ID para não repetir */
export async function getRandomQuote(excludeId?: string): Promise<Quote> {
  const params = excludeId ? `?excludeId=${excludeId}` : '';
  return fetchApi<Quote>(`/quotes/random${params}`);
}

/** Busca lista paginada de citações */
export async function getQuotes(params?: {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<QuoteListResponse> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.tag) search.set('tag', params.tag);
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const qs = search.toString() ? `?${search.toString()}` : '';
  return fetchApi<QuoteListResponse>(`/quotes${qs}`);
}

/** Busca uma citação por ID */
export async function getQuoteById(id: string): Promise<Quote> {
  return fetchApi<Quote>(`/quotes/${id}`);
}

/** Busca todas as categorias disponíveis */
export async function getCategories(): Promise<string[]> {
  return fetchApi<string[]>('/quotes/categories');
}

/** Busca todos os autores disponíveis */
export async function getAuthors(): Promise<string[]> {
  return fetchApi<string[]>('/quotes/authors');
}
