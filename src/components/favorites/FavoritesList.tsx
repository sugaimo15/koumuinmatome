'use client';

import { Heart } from 'lucide-react';
import type { Exam } from '@/types/exam';
import ExamCard from '@/components/exam/ExamCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesList({ allExams }: { allExams: Exam[] }) {
  const { favorites, ready } = useFavorites();

  if (!ready) {
    return <div className="text-center py-12 text-slate-400">読み込み中...</div>;
  }

  const favoriteExams = allExams.filter((e) => favorites.includes(e.id));

  if (favoriteExams.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Heart className="w-14 h-14 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">お気に入りはまだありません</p>
        <p className="text-sm mt-1">試験カードのハートボタンから追加できます</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-5">{favoriteExams.length}件のお気に入り</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favoriteExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
