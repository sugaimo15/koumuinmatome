import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, ChevronRight, Clock, Users, GraduationCap, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllExamIds, getExamById, getAllExams } from '@/lib/getExams';
import { formatDate, formatRatio, formatApplicants, educationLabel, subjectTypeLabel, difficultyLabel } from '@/lib/formatters';
import CategoryBadge from '@/components/ui/CategoryBadge';
import DifficultyMeter from '@/components/ui/DifficultyMeter';
import Tag from '@/components/ui/Tag';
import AffiliateSection from '@/components/exam/AffiliateSection';
import type { AffiliateItem } from '@/types/affiliate';
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  return getAllExamIds().map((e) => ({
    category: e.category,
    examId: e.examId,
  }));
}

function getAffiliates(examId: string): { books: AffiliateItem[]; courses: AffiliateItem[] } {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'src/data/affiliates/index.json'), 'utf-8');
    const all: AffiliateItem[] = JSON.parse(raw);
    const matched = all.filter((a) => a.examIds.includes(examId));
    return {
      books: matched.filter((a) => a.type === 'book'),
      courses: matched.filter((a) => a.type === 'course'),
    };
  } catch {
    return { books: [], courses: [] };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; examId: string }>;
}): Promise<Metadata> {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) return {};
  return {
    title: exam.name,
    description: exam.overview.description,
    openGraph: { title: exam.name, description: exam.overview.description },
  };
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ category: string; examId: string }>;
}) {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) notFound();

  const { books, courses } = getAffiliates(examId);
  const latestStat = exam.stats.at(-1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-600">トップ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/exams" className="hover:text-slate-600">試験一覧</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600">{exam.shortName}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={exam.category} size="md" />
            {exam.subcategory && (
              <span className="inline-flex items-center bg-slate-100 text-slate-600 text-sm px-3 py-1.5 rounded-full border border-slate-200">
                {exam.subcategory}
              </span>
            )}
          </div>
          <a
            href={exam.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            公式サイト
          </a>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">{exam.name}</h1>
        <p className="text-slate-600 leading-relaxed mb-5">{exam.overview.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {exam.overview.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1.5">難易度</p>
            <DifficultyMeter level={exam.overview.difficulty} showLabel />
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">年齢上限</p>
            <p className="text-lg font-bold text-slate-800">{exam.overview.ageLimit.max}歳</p>
            {exam.overview.ageLimit.note && (
              <p className="text-xs text-slate-400 mt-0.5">{exam.overview.ageLimit.note}</p>
            )}
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">必要学歴</p>
            <p className="text-sm font-semibold text-slate-800">{educationLabel(exam.overview.education)}</p>
          </div>
          {latestStat && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">最新倍率</p>
              <p className="text-lg font-bold text-slate-800">{formatRatio(latestStat.competitionRatio)}</p>
              <p className="text-xs text-slate-400">（{latestStat.year}年）</p>
            </div>
          )}
        </div>

        {exam.overview.workLocation && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <span className="text-slate-400">勤務地：</span>{exam.overview.workLocation}
          </div>
        )}
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">試験科目・内容</h2>
        <div className="space-y-3">
          {exam.subjects.map((subject, i) => (
            <div key={i} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-slate-800 text-sm">{subject.name}</h3>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded flex-shrink-0">
                  {subjectTypeLabel(subject.type)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">{subject.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                {subject.questionCount && (
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{subject.questionCount}問</span>
                )}
                {subject.duration && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{subject.duration}分</span>
                )}
                {subject.weight && (
                  <span>配点比率：{subject.weight}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">受験者数・倍率推移</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">年度</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">受験者数</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">合格者数</th>
                <th className="text-right text-xs font-semibold text-slate-500 pb-3 pr-4">倍率</th>
                {exam.stats.some((s) => s.hireCount) && (
                  <th className="text-right text-xs font-semibold text-slate-500 pb-3">採用予定</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[...exam.stats].reverse().map((stat) => (
                <tr key={stat.year} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-700">{stat.year}年</td>
                  <td className="py-3 pr-4 text-right text-slate-600">{formatApplicants(stat.applicantCount)}</td>
                  <td className="py-3 pr-4 text-right text-slate-600">{formatApplicants(stat.passCount)}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-slate-800">{formatRatio(stat.competitionRatio)}</td>
                  {exam.stats.some((s) => s.hireCount) && (
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
        ⚠️ 掲載情報（最終確認日：{formatDate(exam.lastUpdated)}）は参考目的です。最新情報は
        <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">公式サイト</a>
        でご確認ください。
      </div>

      {/* Affiliate */}
      <AffiliateSection books={books} courses={courses} />

      {/* CTA */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/exams" className="text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-colors">
          ← 試験一覧に戻る
        </Link>
        <Link href={`/compare?a=${exam.id}`} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors">
          この試験と比較する
        </Link>
      </div>
    </div>
  );
}
