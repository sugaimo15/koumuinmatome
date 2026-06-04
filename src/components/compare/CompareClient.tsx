'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';
import type { Exam } from '@/types/exam';
import CategoryBadge from '@/components/ui/CategoryBadge';
import DifficultyMeter from '@/components/ui/DifficultyMeter';
import { formatRatio, formatApplicants, educationLabel, formatSalary, difficultyLabel } from '@/lib/formatters';
import { clsx } from 'clsx';

interface Props {
  selectedExams: Exam[];
  allExams: Exam[];
}

export default function CompareClient({ selectedExams, allExams }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const updateURL = (exams: Exam[]) => {
    const params = new URLSearchParams();
    exams.forEach((e, i) => params.set(String.fromCharCode(97 + i), e.id));
    router.push(`/compare?${params.toString()}`);
  };

  const addExam = (exam: Exam) => {
    if (selectedExams.length >= 3 || selectedExams.find((e) => e.id === exam.id)) return;
    updateURL([...selectedExams, exam]);
    setSearchQuery('');
  };

  const removeExam = (id: string) => {
    updateURL(selectedExams.filter((e) => e.id !== id));
  };

  const available = allExams.filter(
    (e) => !selectedExams.find((s) => s.id === e.id)
  );
  const filtered = searchQuery
    ? available.filter((e) =>
        e.name.includes(searchQuery) || e.shortName.includes(searchQuery)
      )
    : available;

  const rows = [
    { label: 'カテゴリ', render: (e: Exam) => <CategoryBadge category={e.category} size="xs" /> },
    { label: '難易度', render: (e: Exam) => <DifficultyMeter level={e.overview.difficulty} /> },
    { label: '年齢上限', render: (e: Exam) => <span>{e.overview.ageLimit.max}歳</span> },
    { label: '必要学歴', render: (e: Exam) => <span>{educationLabel(e.overview.education)}</span> },
    {
      label: '最新倍率',
      render: (e: Exam) => {
        const s = e.stats.at(-1);
        return s ? <span className="font-semibold">{formatRatio(s.competitionRatio)}</span> : <span>—</span>;
      },
      compareValues: (e: Exam) => e.stats.at(-1)?.competitionRatio,
      betterIsLower: true,
    },
    {
      label: '受験者数',
      render: (e: Exam) => {
        const s = e.stats.at(-1);
        return s ? <span>{formatApplicants(s.applicantCount)}</span> : <span>—</span>;
      },
    },
    {
      label: '給与目安',
      render: (e: Exam) =>
        e.overview.salaryRange ? (
          <span>
            {formatSalary(e.overview.salaryRange.min)} 〜 {formatSalary(e.overview.salaryRange.max)}
          </span>
        ) : (
          <span>—</span>
        ),
    },
    { label: '勤務地', render: (e: Exam) => <span className="text-xs">{e.overview.workLocation ?? '—'}</span> },
  ];

  return (
    <div>
      {/* 試験選択エリア */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">
          比較する試験を選択（最大3つ）
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedExams.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl text-sm"
            >
              {e.shortName}
              <button onClick={() => removeExam(e.id)} className="hover:text-indigo-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {selectedExams.length < 3 && (
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-400 px-3 py-1.5 rounded-xl text-sm">
              <Plus className="w-3.5 h-3.5" />
              試験を追加
            </div>
          )}
        </div>
        {selectedExams.length < 3 && (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="試験名を入力して検索..."
              className="w-full sm:max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
            />
            {(searchQuery || true) && (
              <div className="flex flex-wrap gap-2">
                {filtered.slice(0, 8).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => addExam(e)}
                    className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {e.shortName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 比較テーブル */}
      {selectedExams.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">上から試験を選択してください</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-sm font-medium text-slate-500 px-5 py-4 w-32">項目</th>
                {selectedExams.map((e) => (
                  <th key={e.id} className="text-left text-sm font-bold text-slate-800 px-5 py-4">
                    {e.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const values = selectedExams.map((e) => row.compareValues?.(e));
                const best = row.compareValues
                  ? row.betterIsLower
                    ? Math.min(...(values.filter(Boolean) as number[]))
                    : Math.max(...(values.filter(Boolean) as number[]))
                  : null;

                return (
                  <tr
                    key={row.label}
                    className={clsx('border-b border-slate-50', ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}
                  >
                    <td className="text-xs font-medium text-slate-500 px-5 py-3.5">{row.label}</td>
                    {selectedExams.map((e) => {
                      const val = row.compareValues?.(e);
                      const isBest = best !== null && val === best;
                      return (
                        <td
                          key={e.id}
                          className={clsx(
                            'text-sm text-slate-700 px-5 py-3.5',
                            isBest && 'bg-emerald-50 text-emerald-700'
                          )}
                        >
                          {row.render(e)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
