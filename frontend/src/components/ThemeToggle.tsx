'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[14px] h-[14px]" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="flex items-center text-stone-400 hover:text-stone-600
                 dark:text-stone-500 dark:hover:text-stone-300 transition-colors duration-200"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
