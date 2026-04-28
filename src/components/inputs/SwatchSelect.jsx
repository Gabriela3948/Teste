export default function SwatchSelect({ question, value = [], onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
      {question.options.map((palette) => {
        const selected = value.includes(palette.id)
        return (
          <button
            key={palette.id}
            type="button"
            onClick={() => toggle(palette.id)}
            className={`
              p-3 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.97]
              ${selected
                ? 'border-obsidian shadow-md'
                : 'border-ivory hover:border-slate/50'
              }
            `}
          >
            <div className="flex gap-1 mb-2 rounded-md overflow-hidden h-8">
              {palette.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs font-medium text-obsidian leading-tight font-sans">
              {palette.label}
            </p>
          </button>
        )
      })}
    </div>
  )
}
