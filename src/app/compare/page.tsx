import type { Metadata } from 'next';
import { getAllExams, getExamById } from '@/lib/getExams';
import CompareClient from '@/components/compare/CompareClient';

export const metadata: Metadata = {
  title: '試験比較',
  description: '複数の公務員試験を並べて比較。難易度・倍率・年齢制限・給与を一覧で確認。',
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}) {
  const params = await searchParams;
  const allExams = getAllExams();

  const selectedExams = ['a', 'b', 'c']
    .map((key) => params[key as 'a' | 'b' | 'c'])
    .filter(Boolean)
    .map((id) => getExamById(id!))
    .filter(Boolean) as (typeof allExams)[number][];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">試験比較</h1>
      <p className="text-slate-500 text-sm mb-8">最大3つの試験を並べて比較できます。比較URLはシェアできます。</p>
      <CompareClient selectedExams={selectedExams} allExams={allExams} />
    </div>
  );
}
