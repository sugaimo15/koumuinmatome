'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Exam } from '@/types/exam';
import ExamCard from '@/components/exam/ExamCard';
import { createSearchIndex } from '@/lib/search';

export default function SearchClient({
  exams,
  initialQuery,
}: {
  exams: Exam[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const fuseIndex = useMemo(() => createSearchIndex(exams), [exams]);

  const results = useMemo(() => {
    if (!query.trim()) return exams;
    const hits = fuseIndex.search(query);
    return hits.map((r) => r.item);
  }, [query, exams, fuseIndex]);

  return (
    <div>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="試験名・キーワードで検索..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          autoFocus
        />
      </div>

      <p className="text-sm text-slate-500 mb-4">
        {query ? `「${query}」の検索結果：${results.length}件` : `全${exams.length}件`}
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">該当する試験が見つかりませんでした</p>
          <p className="text-sm mt-1">別のキーワードで検索してみてください</p>
        </div>
      )}
    </div>
  );
}
