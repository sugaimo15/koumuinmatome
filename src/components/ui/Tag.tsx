export default function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
      {label}
    </span>
  );
}
