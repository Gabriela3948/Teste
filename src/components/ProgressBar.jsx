export default function ProgressBar({ current, total, section }) {
  const progress = (current / total) * 100

  return (
    <div className="sticky top-0 z-10 bg-pearl/95 backdrop-blur-sm border-b border-ivory/60">
      <div
        className="h-0.5 bg-obsidian transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xs font-medium text-slate tracking-widest uppercase font-sans">
          {section}
        </span>
        <span className="text-xs text-slate/60 font-sans tabular-nums">
          {current} <span className="text-slate/30">/</span> {total}
        </span>
      </div>
    </div>
  )
}
