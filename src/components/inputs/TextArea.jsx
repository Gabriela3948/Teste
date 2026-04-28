export default function TextArea({ question, value = '', onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      rows={4}
      className="w-full bg-pearl/40 border border-ivory focus:border-obsidian outline-none px-4 py-3 rounded-xl text-obsidian placeholder-slate/50 text-base transition-colors font-sans resize-none leading-relaxed"
    />
  )
}
