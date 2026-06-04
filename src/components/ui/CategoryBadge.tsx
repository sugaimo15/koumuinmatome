import { clsx } from 'clsx';
import type { ExamCategory } from '@/types/exam';

const styles: Record<ExamCategory, string> = {
  national: 'bg-blue-100 text-blue-700 border-blue-200',
  local: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  technical: 'bg-violet-100 text-violet-700 border-violet-200',
  security: 'bg-red-100 text-red-700 border-red-200',
};

const labels: Record<ExamCategory, string> = {
  national: '国家公務員',
  local: '地方公務員',
  technical: '技術系専門職',
  security: '公安・消防・自衛隊',
};

export default function CategoryBadge({
  category,
  size = 'sm',
}: {
  category: ExamCategory;
  size?: 'xs' | 'sm' | 'md';
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center border rounded-full font-medium',
        styles[category],
        size === 'xs' && 'px-2 py-0.5 text-xs',
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm'
      )}
    >
      {labels[category]}
    </span>
  );
}

export { labels as categoryLabels, styles as categoryStyles };
