'use client';

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { ScheduleEvent } from '@/types/schedule';
import { eventTypeLabel } from '@/lib/formatters';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { ja },
});

const categoryColorMap: Record<string, string> = {
  national: '#3b82f6',
  local: '#10b981',
  technical: '#8b5cf6',
  security: '#ef4444',
};

const messages = {
  today: '今日',
  previous: '前へ',
  next: '次へ',
  month: '月',
  week: '週',
  day: '日',
  agenda: 'リスト',
  date: '日付',
  time: '時間',
  event: 'イベント',
  noEventsInRange: 'この期間にイベントはありません',
};

export default function CalendarView({ events }: { events: ScheduleEvent[] }) {
  const calEvents = events.map((e) => ({
    id: e.id,
    title: `${e.examName} ${eventTypeLabel(e.eventType)}`,
    start: new Date(e.date + 'T00:00:00'),
    end: e.endDate ? new Date(e.endDate + 'T23:59:59') : new Date(e.date + 'T23:59:59'),
    resource: e,
  }));

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={calEvents}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.AGENDA]}
        messages={messages}
        culture="ja"
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: categoryColorMap[event.resource.category] ?? '#6366f1',
            border: 'none',
            borderRadius: '4px',
          },
        })}
      />
    </div>
  );
}
