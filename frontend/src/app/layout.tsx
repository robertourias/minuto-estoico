import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from "@vercel/analytics/next"
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Minuto Estoico — Uma reflexão por dia',
  description:
    'Dedique um minuto do seu dia para uma reflexão inspirada nos ensinamentos estoicos. Citações de Marco Aurélio, Sêneca, Epicteto e outros filósofos clássicos.',
  keywords: ['estoicismo', 'filosofia', 'citações', 'reflexão', 'meditação', 'mindfulness'],
  authors: [{ name: 'Minuto Estoico' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Minuto Estoico — Uma reflexão por dia',
    description: 'Citações estoicas diárias para desenvolver serenidade, sabedoria e autocontrole.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minuto Estoico',
    description: 'Citações estoicas diárias para desenvolver serenidade e sabedoria.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-parchment-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
