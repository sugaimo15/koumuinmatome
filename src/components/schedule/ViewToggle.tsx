'use client';

import { Calendar, List } from 'lucide-react';
import { clsx } from 'clsx';

export default function ViewToggle({
  view,
  onChange,
}: {
  view: 'calendar' | 'list';
  onChange: (v: 'calendar' | 'list') => void;
}) {
  return (
    <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
      {(
        [
          { key: 'calendar', icon: Calendar, label: 'カレンダー' },
          { key: 'list', icon: List, label: 'リスト' },
        ] as const
      ).map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            view === key
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
