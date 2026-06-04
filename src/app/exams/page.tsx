import { getAllExams, getCategories } from '@/lib/getExams';
import ExamCard from '@/components/exam/ExamCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { Metadata } from 'next';
import type { ExamCategory } from '@/types/exam';
import { educationLabel } from '@/lib/formatters';

export const metadata: Metadata = {
  title: '試験一覧',
  description: '国家公務員・地方公務員・技術系・公安系の公務員試験を一覧・比較。難易度・倍率・必要学歴を確認できます。',
};

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; difficulty?: string; education?: string }>;
}) {
  const params = await searchParams;
  const allExams = getAllExams();
  const categories = getCategories();

  let exams = allExams;
  if (params.category) exams = exams.filter((e) => e.category === params.category);
  if (params.difficulty) exams = exams.filter((e) => e.overview.difficulty === Number(params.difficulty));
  if (params.education) exams = exams.filter((e) => e.overview.education === params.education);

  const buildURL = (key: string, value: string) => {
    const p = new URLSearchParams(params as Record<string, string>);
    if (p.get(key) === value) p.delete(key);
    else p.set(key, value);
    return `/exams?${p.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">試験一覧</h1>
        <p className="text-slate-500">{exams.length}件の試験を表示中</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 sticky top-20">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">カテゴリ</h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={buildURL('category', cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      params.category === cat.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CategoryBadge category={cat.id as ExamCategory} size="xs" />
                    <span className="text-xs">{cat.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">難易度</h3>
              <div className="space-y-1">
                {[1, 2, 3, 4, 5].map((d) => (
                  <a
                    key={d}
                    href={buildURL('difficulty', String(d))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      Number(params.difficulty) === d
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {'●'.repeat(d)}{'○'.repeat(5 - d)}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">学歴</h3>
              <div className="space-y-1">
                {(['university', 'junior-college', 'high-school'] as const).map((e) => (
                  <a
                    key={e}
                    href={buildURL('education', e)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      params.education === e
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {educationLabel(e)}
                  </a>
                ))}
              </div>
            </div>

            {(params.category || params.difficulty || params.education) && (
              <a href="/exams" className="block text-center text-xs text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg py-2 transition-colors">
                フィルターをリセット
              </a>
            )}
          </div>
        </aside>

        {/* Exam grid */}
        <div className="flex-1">
          {exams.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-medium">条件に合う試験が見つかりません</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
