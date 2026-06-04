import Link from 'next/link';
import { ArrowRight, Calendar, Search, Heart, ChevronRight, MapPin } from 'lucide-react';
import { getAllExams, getCategories } from '@/lib/getExams';
import { getUpcomingEvents } from '@/lib/getSchedules';
import { eventTypeLabel } from '@/lib/formatters';
import CategoryBadge from '@/components/ui/CategoryBadge';
import type { ExamCategory } from '@/types/exam';

const categoryGradients: Record<ExamCategory, string> = {
  national: 'from-blue-500 to-blue-600',
  local: 'from-emerald-500 to-emerald-600',
  technical: 'from-violet-500 to-violet-600',
  security: 'from-red-500 to-red-600',
};

export default function HomePage() {
  const categories = getCategories();
  const allExams = getAllExams();
  const upcoming = getUpcomingEvents(6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-300 text-sm font-medium mb-3 tracking-widest uppercase">Civil Service Exam Guide</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            公務員試験を<br />
            <span className="text-indigo-300">比べて、選ぶ。</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            国家・地方・技術系・公安系の公務員試験情報を一箇所にまとめました。
            難易度・倍率・スケジュールを比較して、あなたに合った試験を見つけましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/exams" className="bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
              試験一覧を見る <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/schedule" className="bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-white/20">
              <Calendar className="w-4 h-4" /> スケジュールを確認
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-indigo-600 text-white py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div><p className="text-2xl font-bold">{allExams.length}</p><p className="text-xs text-indigo-200">掲載試験数</p></div>
          <div><p className="text-2xl font-bold">{categories.length}</p><p className="text-xs text-indigo-200">カテゴリ</p></div>
          <div><p className="text-2xl font-bold">{upcoming.length}</p><p className="text-xs text-indigo-200">直近イベント</p></div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Search, title: '試験を探す・比較する', desc: '難易度・倍率・科目を並べて比べられる。', href: '/exams', color: 'text-indigo-500 bg-indigo-50' },
            { icon: Calendar, title: 'スケジュールを確認', desc: '申込締切・試験日・合格発表を一覧表示。', href: '/schedule', color: 'text-emerald-500 bg-emerald-50' },
            { icon: Heart, title: 'お気に入りに保存', desc: 'ログイン不要でブラウザに保存できます。', href: '/favorites', color: 'text-rose-500 bg-rose-50' },
          ].map(({ icon: Icon, title, desc, href, color }) => (
            <Link key={href} href={href} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}><Icon className="w-5 h-5" /></div>
              <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-t border-slate-100 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">試験カテゴリ</h2>
          <p className="text-slate-500 text-sm mb-8">4つのカテゴリから試験を探せます</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/exams?category=${cat.id}`} className="flex items-center gap-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-sm rounded-2xl p-5 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryGradients[cat.id as ExamCategory]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {cat.label.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{cat.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{cat.description}</p>
                  <p className="text-xs text-indigo-500 mt-1.5">{cat.examIds.length}試験掲載</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming schedule */}
      {upcoming.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">直近のスケジュール</h2>
            <Link href="/schedule" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              すべて見る <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <div key={event.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
                <div className="text-center w-14 flex-shrink-0">
                  <p className="text-xs text-slate-400">{event.date.slice(5, 7)}月</p>
                  <p className="text-2xl font-bold text-slate-800 leading-none">{parseInt(event.date.slice(8, 10))}</p>
                  <p className="text-xs text-slate-400">日</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{event.examName}</p>
                  <p className="text-xs text-slate-500">{eventTypeLabel(event.eventType)}</p>
                </div>
                <CategoryBadge category={event.category as ExamCategory} size="xs" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Municipality CTA */}
      <section className="bg-emerald-50 border-t border-emerald-100 py-14">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-2">
              <MapPin className="w-5 h-5" />
              自治体別の試験を探す
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              仙台市・名取市・宮城県など、都道府県・市区町村ごとの採用試験情報を掲載。
              あなたの地元の試験をチェックしよう。
            </p>
          </div>
          <Link
            href="/municipalities"
            className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            自治体一覧へ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Notice */}
      <div className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          ⚠️ 当サイトの試験情報は参考目的です。必ず各試験の公式サイトで最新情報をご確認ください。
        </div>
      </div>
    </div>
  );
}
