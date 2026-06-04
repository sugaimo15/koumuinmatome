import fs from 'fs';
import path from 'path';
import type { YearSchedule, ScheduleEvent, CalendarEvent } from '@/types/schedule';
import { eventTypeLabel } from '@/lib/formatters';

const SCHEDULES_DIR = path.join(process.cwd(), 'src/data/schedules');

export function getScheduleByYear(year: number): YearSchedule {
  const file = path.join(SCHEDULES_DIR, `${year}.json`);
  if (!fs.existsSync(file)) {
    return { year, lastUpdated: '', events: [] };
  }
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw) as YearSchedule;
}

export function getUpcomingEvents(limit = 5): ScheduleEvent[] {
  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();
  const schedule = getScheduleByYear(year);
  return schedule.events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function toCalendarEvents(events: ScheduleEvent[]): CalendarEvent[] {
  return events.map((e) => {
    const start = new Date(e.date + 'T00:00:00');
    const end = e.endDate ? new Date(e.endDate + 'T23:59:59') : new Date(e.date + 'T23:59:59');
    return {
      id: e.id,
      title: `${e.examName} - ${eventTypeLabel(e.eventType)}`,
      start,
      end,
      resource: e,
    };
  });
}

