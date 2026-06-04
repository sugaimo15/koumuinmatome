import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getPrefectureIndex, getAllPrefectureParams, municipalityTypeLabel } from '@/lib/getMunicipalities';

export async function generateStaticParams() {
  return getAllPrefectureParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefectureSlug: string }>;
}): Promise<Metadata> {
  const { prefectureSlug } = await params;
  const index = getPrefectureIndex(prefectureSlug);
  if (!index) return {};
  return {
    title: `${index.name}の公務員試験`,
    description: `${index.name}の自治体別公務員試験情報。${index.municipalities.map((m) => m.name).join('・')}などの試験詳細を確認できます。`,
  };
}

const typeColors: Record<string, string> = {
  prefecture: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'designated-city': 'bg-blue-100 text-blue-700 border-blue-200',
  city: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  town: 'bg-amber-100 text-amber-700 border-amber-200',
  village: 'bg-orange-100 text-orange-700 border-orange-200',
  'special-ward': 'bg-violet-100 text-violet-700 border-violet-200',
};

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ prefectureSlug: string }>;
}) {
  const { prefectureSlug } = await params;
  const index = getPrefectureIndex(prefectureSlug);
  if (!index) notFound();

  const typeOrder = ['prefecture', 'designated-city', 'special-ward', 'city', 'town', 'village'];
  const sorted = [...index.municipalities].sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-600">トップ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/municipalities" className="hover:text-slate-600">自治体一覧</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600">{index.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
            {index.name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{index.name}</h1>
            <p className="text-slate-400 text-sm">{index.region}</p>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-3">
          {index.municipalities.length}件の自治体試験情報を掲載しています。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((m) => (
          <Link
            key={m.slug}
            href={`/municipalities/${prefectureSlug}/${m.slug}`}
            className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
              <Building2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{m.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${typeColors[m.type] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {municipalityTypeLabel(m.type)}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
