import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Copia texto para a área de transferência */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para browsers mais antigos
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
}

/** Gera texto de compartilhamento formatado */
export function buildShareText(quote: { text: string; author: string; reflection: string }): string {
  return `"${quote.text}"\n— ${quote.author}\n\n${quote.reflection}\n\n🌿 Minuto Estoico`;
}

/** Gera URL de compartilhamento para WhatsApp */
export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Gera URL de compartilhamento para Twitter/X */
export function buildTwitterUrl(text: string, url: string): string {
  const tweet = `${text.substring(0, 200)}... ${url}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}

/** Formata data para exibição */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
