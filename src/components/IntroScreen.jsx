export default function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-pearl flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-7xl md:text-9xl text-obsidian tracking-tight leading-none mb-1">
        GSA
      </h1>
      <p className="text-slate text-xs tracking-widest uppercase font-sans mb-16">
        Marketing &amp; Growth
      </p>

      <div className="max-w-md w-full">
        <h2 className="font-serif text-3xl md:text-4xl text-obsidian leading-tight mb-5">
          Antes de construir a sua marca, preciso te conhecer de verdade.
        </h2>
        <p className="text-slate text-sm md:text-base font-sans leading-relaxed mb-3">
          Esse não é um formulário. É uma conversa. Responde do jeito que vier — sem filtro, sem pressa.
        </p>
        <p className="text-slate text-sm md:text-base font-sans leading-relaxed mb-10">
          Cada resposta vai me ajudar a criar algo completamente único para você.
        </p>

        <div className="flex items-center justify-center gap-6 mb-10">
          <span className="text-slate/60 text-xs font-sans">~50 perguntas</span>
          <span className="w-1 h-1 rounded-full bg-ivory" />
          <span className="text-slate/60 text-xs font-sans">20 a 30 minutos</span>
          <span className="w-1 h-1 rounded-full bg-ivory" />
          <span className="text-slate/60 text-xs font-sans">sem resposta errada</span>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-obsidian text-pearl py-4 rounded-2xl text-sm font-medium font-sans hover:bg-obsidian/90 transition-all active:scale-[0.98] tracking-wide"
        >
          Começar minha jornada →
        </button>
      </div>
    </div>
  )
}
