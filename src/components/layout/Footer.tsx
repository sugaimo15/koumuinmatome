import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="font-bold">公務員試験まとめ</span>
            </div>
            <p className="text-xs leading-relaxed">
              公務員試験の情報を整理・比較できる情報サイト。最新情報は必ず各試験の公式サイトでご確認ください。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">メニュー</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/exams', label: '試験一覧' },
                { href: '/municipalities', label: '自治体別' },
                { href: '/schedule', label: 'スケジュール' },
                { href: '/compare', label: '試験比較' },
                { href: '/favorites', label: 'お気に入り' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">試験カテゴリ</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/exams?category=national', label: '国家公務員' },
                { href: '/exams?category=local', label: '地方公務員' },
                { href: '/exams?category=technical', label: '技術系専門職' },
                { href: '/exams?category=security', label: '公安・消防・自衛隊' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© 2025 公務員試験まとめ. 掲載情報は参考であり、試験の正確な情報は各公式サイトをご確認ください。</p>
          <p>当サイトはアフィリエイト広告を利用しています。</p>
        </div>
      </div>
    </footer>
  );
}
