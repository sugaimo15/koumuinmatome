import type { Metadata } from 'next';
import { getScheduleByYear } from '@/lib/getSchedules';
import ScheduleClient from '@/components/schedule/ScheduleClient';

export const metadata: Metadata = {
  title: '試験スケジュール',
  description: '2025年の公務員試験スケジュール一覧。申込締切・試験日・合格発表日をカレンダーとリストで確認できます。',
};

export default function SchedulePage() {
  const schedule = getScheduleByYear(2025);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">試験スケジュール</h1>
        <p className="text-slate-500 text-sm">
          2025年度の主要公務員試験の日程一覧です。
          <span className="ml-1 text-amber-600">「予定」と表示されているものは確定前の情報です。公式サイトでご確認ください。</span>
        </p>
      </div>
      <ScheduleClient events={schedule.events} />
    </div>
  );
}
