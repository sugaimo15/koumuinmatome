import type { Metadata } from 'next';
import { Noto_Sans_JP, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '公務員試験まとめ | 試験情報・スケジュール一覧',
    template: '%s | 公務員試験まとめ',
  },
  description:
    '公務員試験の種別一覧・比較、試験スケジュール管理、勉強法をまとめた情報サイト。国家公務員・地方公務員・技術系・公安系の試験情報を網羅。',
  keywords: ['公務員試験', '国家公務員', '地方公務員', '試験日程', '倍率', '試験対策'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: '公務員試験まとめ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
