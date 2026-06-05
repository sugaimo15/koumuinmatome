import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, ChevronRight, Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getMunicipality, getAllMunicipalityParams, municipalityTypeLabel } from '@/lib/getMunicipalities';
import { formatDate, formatRatio, formatApplicants } from '@/lib/formatters';
import DifficultyMeter from '@/components/ui/DifficultyMeter';
import Tag from '@/components/ui/Tag';
import type { ExamTypeSchedule } from '@/types/municipality';

export async function generateStaticParams() {
  return getAllMunicipalityParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefectureSlug: string; citySlug: string }>;
}): Promise<Metadata> {
  const { prefectureSlug, citySlug } = await params;
  const m = getMunicipality(prefectureSlug, citySlug);
  if (!m) return {};
  return {
    title: `${m.name}職員採用試験`,
    description: m.overview.description,
    openGraph: { title: `${m.name}職員採用試験 | 公務員試験まとめ`, description: m.overview.description },
  };
}

const typeColors: Record<string, string> = {
  prefecture: 'bg-indigo-100 text-indigo-700',
  'designated-city': 'bg-blue-100 text-blue-700',
  city: 'bg-emerald-100 text-emerald-700',
  town: 'bg-amber-100 text-amber-700',
  village: 'bg-orange-100 text-orange-700',
  'special-ward': 'bg-violet-100 text-violet-700',
};

const scheduleRows: { key: keyof ExamTypeSchedule; label: string }[] = [
  { key: 'applicationStart', label: '申込開始' },
  { key: 'applicationEnd', label: '申込締切' },
  { key: 'firstExam', label: '一次試験' },
  { key: 'firstResult', label: '一次合格発表' },
  { key: 'secondExam', label: '二次試験' },
  { key: 'finalResult', label: '最終合格発表' },
];

export default async function MunicipalityDetailPage({
  params,
}: {
  params: Promise<{ prefectureSlug: string; citySlug: string }>;
}) {
  const { prefectureSlug, citySlug } = await params;
  const m = getMunicipality(prefectureSlug, citySlug);
  if (!m) notFound();

  const latestStat = m.stats.at(-1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-slate-600">トップ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/municipalities" className="hover:text-slate-600">自治体一覧</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/municipalities/${prefectureSlug}`} className="hover:text-slate-600">{m.prefectureName}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600">{m.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center text-sm px-3 py-1.5 rounded-full font-medium ${typeColors[m.type] ?? 'bg-slate-100 text-slate-600'}`}>
              {municipalityTypeLabel(m.type)}
            </span>
            <span className="inline-flex items-center text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
              {m.prefectureName}
            </span>
          </div>
          <a
            href={m.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            公式サイト
          </a>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">{m.name}</h1>
        <p className="text-sm text-slate-500 mb-4">職員採用試験情報</p>
        <p className="text-slate-600 leading-relaxed mb-4">{m.overview.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {m.overview.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 mb-1.5">難易度</p>
            <DifficultyMeter level={m.overview.difficulty} showLabel />
          </div>
          {latestStat && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">最新倍率</p>
              <p className="text-lg font-bold text-slate-800">{formatRatio(latestStat.competitionRatio)}</p>
              <p className="text-xs text-slate-400">（{latestStat.year}年）</p>
            </div>
          )}
        </div>
      </div>

      {/* Exam types */}
      <div className="space-y-4 mb-6">
        {m.examTypes.map((et, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between gap-3">
              <h2 className="font-bold text-indigo-900 text-base">{et.name}</h2>
              <a
                href={m.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
              >
                公式サイト <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-6 space-y-6">
              {/* Schedule */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">日程</h3>
                <div>
                  {scheduleRows
                    .filter((row) => et.schedule[row.key])
                    .map((row) => (
                      <div key={row.key} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                        <span className="text-xs font-medium text-slate-400 w-28 flex-shrink-0 pt-0.5">{row.label}</span>
                        <span className="text-sm text-slate-800">{et.schedule[row.key]}</span>
                      </div>
                    ))}
                </div>
                {et.schedule.note && (
                  <p className="mt-3 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                    💡 {et.schedule.note}
                  </p>
                )}
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">受験資格</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{et.eligibility.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {et.eligibility.ageMax && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      年齢上限 {et.eligibility.ageMax}歳
                      {et.eligibility.ageNote && `（${et.eligibility.ageNote}）`}
                    </span>
                  )}
                  {et.eligibility.education && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      {et.eligibility.education}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <a
                href={m.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-colors group"
              >
                <span className="text-sm font-semibold">詳しくは公式サイトから</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          受験者数・倍率推移
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">年度</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">受験者数</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">合格者数</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">倍率</th>
                {m.stats.some((s) => s.hireCount) && (
                  <th className="text-right text-xs font-semibold text-slate-500 pb-3">採用予定</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[...m.stats].reverse().map((stat) => (
                <tr key={stat.year} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-700">{stat.year}年</td>
                  <td className="py-3 pr-4 text-right text-slate-600">{formatApplicants(stat.applicantCount)}</td>
                  <td className="py-3 pr-4 text-right text-slate-600">{formatApplicants(stat.passCount)}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-slate-800">{formatRatio(stat.competitionRatio)}</td>
                  {m.stats.some((s) => s.hireCount) && (
                    <td className="py-3 text-right text-slate-600">{stat.hireCount ? formatApplicants(stat.hireCount) : '—'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
        ⚠️ 掲載情報（最終確認日：{formatDate(m.lastUpdated)}）は参考目的です。最新情報は
        <a href={m.officialUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">公式サイト</a>
        でご確認ください。
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/municipalities/${prefectureSlug}`} className="text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-colors">
          ← {m.prefectureName}の一覧に戻る
        </Link>
        <Link href="/municipalities" className="text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-colors">
          全国一覧へ
        </Link>
      </div>
    </div>
  );
}
