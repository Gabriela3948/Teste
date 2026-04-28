import { useState } from 'react'

export default function MultiSelect({ question, value = [], onChange }) {
  const [customText, setCustomText] = useState('')

  const toggle = (option) => {
    const max = question.maxSelections
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else if (!max || value.length < max) {
      onChange([...value, option])
    }
  }

  const addCustom = () => {
    const trimmed = customText.trim()
    if (!trimmed || value.includes(trimmed)) return
    const max = question.maxSelections
    if (!max || value.length < max) {
      onChange([...value, trimmed])
      setCustomText('')
    }
  }

  const atMax = question.maxSelections && value.length >= question.maxSelections

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-1">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`
              px-4 py-2 rounded-full border text-sm font-medium font-sans transition-all duration-200 active:scale-[0.97]
              ${value.includes(option)
                ? 'bg-obsidian text-pearl border-obsidian'
                : atMax
                  ? 'bg-white text-slate/50 border-ivory cursor-not-allowed'
                  : 'bg-white text-obsidian border-ivory hover:border-obsidian/50'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {question.allowCustom && (
        <div className="flex items-center gap-2 mt-4 border border-ivory rounded-xl px-4 py-2 focus-within:border-obsidian transition-colors">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder={question.customPlaceholder || 'Adicionar...'}
            disabled={!!atMax}
            className="flex-1 bg-transparent outline-none text-sm text-obsidian placeholder-slate/40 font-sans disabled:opacity-40"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customText.trim() || !!atMax}
            className="text-xs text-slate hover:text-obsidian transition-colors disabled:opacity-30 font-sans shrink-0"
          >
            + Adicionar
          </button>
        </div>
      )}

      {question.maxSelections && (
        <p className="text-slate/50 text-xs mt-2 font-sans">
          {value.length}/{question.maxSelections} selecionad{value.length === 1 ? 'a' : 'as'}
        </p>
      )}
    </div>
  )
}
