'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { clsx } from 'clsx';
import type { ScheduleEvent } from '@/types/schedule';
import ViewToggle from './ViewToggle';
import { eventTypeLabel } from '@/lib/formatters';
import { formatDate } from '@/lib/formatters';

const CalendarView = dynamic(() => import('./CalendarView'), { ssr: false });

const categoryColors: Record<string, string> = {
  national: 'bg-blue-100 text-blue-700 border-blue-200',
  local: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  technical: 'bg-violet-100 text-violet-700 border-violet-200',
  security: 'bg-red-100 text-red-700 border-red-200',
};

const eventTypeColors: Record<string, string> = {
  'application-start': 'text-green-600',
  'application-end': 'text-orange-600',
  'exam-written': 'text-blue-600',
  'exam-result': 'text-indigo-600',
  'exam-interview': 'text-violet-600',
  'exam-final-result': 'text-red-600',
  appointment: 'text-slate-600',
};

export default function ScheduleClient({ events }: { events: ScheduleEvent[] }) {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [filterCategory, setFilterCategory] = useState<string>('');

  const categories = [
    { value: '', label: '全て' },
    { value: 'national', label: '国家公務員' },
    { value: 'local', label: '地方公務員' },
    { value: 'technical', label: '技術系専門職' },
    { value: 'security', label: '公安・消防・自衛隊' },
  ];

  const filtered = filterCategory
    ? events.filter((e) => e.category === filterCategory)
    : events;

  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <ViewToggle view={view} onChange={setView} />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCategory(c.value)}
              className={clsx(
                'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                filterCategory === c.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView events={filtered} />
      ) : (
        <div className="space-y-3">
          {sorted.length === 0 ? (
            <p className="text-center py-12 text-slate-400">該当するイベントがありません</p>
          ) : (
            sorted.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-16 text-center flex-shrink-0">
                  <p className="text-xs text-slate-400">{event.date.slice(0, 7).replace('-', '/')}</p>
                  <p className="text-xl font-bold text-slate-800 leading-none">
                    {parseInt(event.date.slice(8, 10))}
                  </p>
                  <p className="text-xs text-slate-400">日</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={clsx(
                        'inline-block px-2 py-0.5 text-xs rounded-full border',
                        categoryColors[event.category] ?? 'bg-slate-100 text-slate-600 border-slate-200'
                      )}
                    >
                      {event.examName}
                    </span>
                    {event.isApproximate && (
                      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">予定</span>
                    )}
                  </div>
                  <p
                    className={clsx(
                      'text-sm font-semibold',
                      eventTypeColors[event.eventType] ?? 'text-slate-700'
                    )}
                  >
                    {eventTypeLabel(event.eventType)}
                    {event.endDate && ` 〜 ${formatDate(event.endDate)}`}
                  </p>
                  {event.note && <p className="text-xs text-slate-400 mt-0.5">{event.note}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
