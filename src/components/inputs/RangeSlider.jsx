export default function RangeSlider({ question, value, onChange }) {
  const current = value ?? question.defaultValue

  return (
    <div className="mt-4 px-1">
      <input
        type="range"
        min={question.min}
        max={question.max}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-obsidian cursor-pointer"
      />

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-slate font-sans">{question.leftLabel}</span>
        <span className="text-sm font-medium text-obsidian font-sans bg-pearl px-3 py-1 rounded-full border border-ivory">
          {question.labels ? question.labels[current - question.min] : current}
        </span>
        <span className="text-xs text-slate font-sans">{question.rightLabel}</span>
      </div>
    </div>
  )
}
