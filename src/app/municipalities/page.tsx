import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { getPrefectureList } from '@/lib/getMunicipalities';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: '自治体別試験一覧',
  description: '都道府県・市区町村ごとの公務員試験情報。仙台市・名取市・宮城県など各自治体の試験詳細を確認できます。',
};

function hasPrefectureData(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'src/data/municipalities', slug));
}

export default function MunicipalitiesPage() {
  const regions = getPrefectureList();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">自治体別試験一覧</h1>
        <p className="text-slate-500 text-sm">
          都道府県・市区町村ごとの採用試験情報。データがある自治体は青色で表示されます。
        </p>
      </div>

      <div className="space-y-8">
        {regions.map((region) => (
          <div key={region.name}>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {region.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {region.prefectures.map((pref) => {
                const hasData = hasPrefectureData(pref.slug);
                return hasData ? (
                  <Link
                    key={pref.slug}
                    href={`/municipalities/${pref.slug}`}
                    className="flex items-center justify-between px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50 hover:shadow-sm transition-all group"
                  >
                    {pref.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <div
                    key={pref.slug}
                    className="flex items-center px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-400"
                  >
                    {pref.name}
                    <span className="ml-auto text-xs">準備中</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        💡 掲載していない自治体の情報追加をご希望の場合はお知らせください。順次追加していきます。
      </div>
    </div>
  );
}
