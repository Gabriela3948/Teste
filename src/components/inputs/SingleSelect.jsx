export default function SingleSelect({ question, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {question.options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`
            px-4 py-2 rounded-full border text-sm font-medium font-sans transition-all duration-200 active:scale-[0.97]
            ${value === option
              ? 'bg-obsidian text-pearl border-obsidian'
              : 'bg-white text-obsidian border-ivory hover:border-obsidian/50'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
