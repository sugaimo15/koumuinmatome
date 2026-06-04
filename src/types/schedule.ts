export type ScheduleEventType =
  | 'application-start'
  | 'application-end'
  | 'exam-written'
  | 'exam-result'
  | 'exam-interview'
  | 'exam-final-result'
  | 'appointment';

export interface ScheduleEvent {
  id: string;
  examId: string;
  examName: string;
  category: string;
  eventType: ScheduleEventType;
  date: string;
  endDate?: string;
  isApproximate: boolean;
  note?: string;
  officialSourceUrl?: string;
}

export interface YearSchedule {
  year: number;
  lastUpdated: string;
  events: ScheduleEvent[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ScheduleEvent;
}
