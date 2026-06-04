import type { Metadata } from 'next';
import { getAllExams } from '@/lib/getExams';
import SearchClient from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: '試験を検索',
  description: '公務員試験をキーワードで検索。試験名・科目・タグから探せます。',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const exams = getAllExams();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">試験を検索</h1>
      <SearchClient exams={exams} initialQuery={params.q ?? ''} />
    </div>
  );
}
