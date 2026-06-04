import { clsx } from 'clsx';
import { difficultyLabel } from '@/lib/formatters';

const colors = ['', 'bg-green-400', 'bg-lime-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-500'];

export default function DifficultyMeter({
  level,
  showLabel = true,
}: {
  level: number;
  showLabel?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={clsx(
              'inline-block w-3 h-3 rounded-sm',
              i <= level ? colors[level] : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500">{difficultyLabel(level)}</span>
      )}
    </div>
  );
}
