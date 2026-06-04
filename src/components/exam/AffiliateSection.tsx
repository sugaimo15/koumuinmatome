import { ExternalLink, BookOpen, PlayCircle } from 'lucide-react';
import type { AffiliateItem } from '@/types/affiliate';

export default function AffiliateSection({
  books,
  courses,
}: {
  books: AffiliateItem[];
  courses: AffiliateItem[];
}) {
  if (books.length === 0 && courses.length === 0) return null;

  return (
    <section className="mt-8">
      <p className="text-xs text-slate-400 mb-4">
        ※ 当サイトはアフィリエイト広告を利用しています
      </p>

      {books.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            おすすめ参考書
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.map((item) => (
              <AffiliateCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-indigo-500" />
            おすすめ通信講座
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((item) => (
              <AffiliateCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AffiliateCard({ item }: { item: AffiliateItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 leading-snug">{item.title}</p>
        {item.publisher && (
          <p className="text-xs text-slate-500 mt-0.5">{item.publisher}</p>
        )}
        {item.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
        )}
        {item.price && (
          <p className="text-xs font-semibold text-indigo-600 mt-1">{item.price}</p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
    </a>
  );
}
