import type { Metadata } from 'next';
import { getAllExams } from '@/lib/getExams';
import FavoritesList from '@/components/favorites/FavoritesList';

export const metadata: Metadata = {
  title: 'お気に入り',
  description: 'お気に入りに登録した公務員試験の一覧。',
};

export default function FavoritesPage() {
  const allExams = getAllExams();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">お気に入り</h1>
      <p className="text-slate-500 text-sm mb-8">
        試験カードのハートボタンから追加できます。ブラウザに保存されます。
      </p>
      <FavoritesList allExams={allExams} />
    </div>
  );
}
