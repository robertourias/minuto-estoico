'use client';

import { Sunrise } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function DailyBadge() {
  const today = formatDate(new Date());

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-2">
      <Sunrise size={13} />
      <span>Reflexão do dia · {today}</span>
    </div>
  );
}
