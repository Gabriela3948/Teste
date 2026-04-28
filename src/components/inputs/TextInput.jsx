export default function TextInput({ question, value = '', onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      className="w-full bg-pearl/40 border border-ivory focus:border-obsidian outline-none px-4 py-3 rounded-xl text-obsidian placeholder-slate/50 text-base transition-colors font-sans"
    />
  )
}
