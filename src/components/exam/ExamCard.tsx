'use client';

import Link from 'next/link';
import { Heart, GraduationCap, Users } from 'lucide-react';
import type { Exam } from '@/types/exam';
import CategoryBadge from '@/components/ui/CategoryBadge';
import DifficultyMeter from '@/components/ui/DifficultyMeter';
import Tag from '@/components/ui/Tag';
import { useFavorites } from '@/hooks/useFavorites';
import { formatRatio, formatApplicants, educationLabel } from '@/lib/formatters';
import { clsx } from 'clsx';

export default function ExamCard({ exam }: { exam: Exam }) {
  const { isFavorite, toggle, ready } = useFavorites();
  const latestStat = exam.stats.at(-1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <CategoryBadge category={exam.category} />
          </div>
          {ready && (
            <button
              onClick={() => toggle(exam.id)}
              className={clsx(
                'flex-shrink-0 p-1.5 rounded-lg transition-colors',
                isFavorite(exam.id)
                  ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-50'
              )}
              aria-label={isFavorite(exam.id) ? 'お気に入り解除' : 'お気に入り追加'}
            >
              <Heart className="w-4 h-4" fill={isFavorite(exam.id) ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">{exam.name}</h3>

        <div className="flex items-center gap-3 mb-3">
          <DifficultyMeter level={exam.overview.difficulty} />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
          {exam.overview.description}
        </p>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>{educationLabel(exam.overview.education)}</span>
            <span className="text-slate-400">・年齢上限{exam.overview.ageLimit.max}歳</span>
          </div>
          {latestStat && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>倍率 {formatRatio(latestStat.competitionRatio)}</span>
              <span className="text-slate-400">（{latestStat.year}年）</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {exam.overview.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      <div className="px-5 pb-5">
        <Link
          href={`/exams/${exam.category}/${exam.id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}
