import { useState } from 'react';

interface Props {
  onComplete: (profile: string, scores: Record<string, number>) => void;
  loading: boolean;
}

const DISC_QUESTIONS = [
  { id: 1, text: "Em situações de pressão, eu geralmente:", options: { D: "Tomo decisões rápidas e assumo controle", I: "Motivo e engajo as pessoas ao redor", S: "Mantenho a calma e apoio a equipe", C: "Analiso os fatos antes de agir" } },
  { id: 2, text: "Meu ambiente de trabalho ideal é:", options: { D: "Desafiador, com autonomia e resultados rápidos", I: "Dinâmico, colaborativo e com reconhecimento", S: "Estável, previsível e harmonioso", C: "Organizado, estruturado com processos claros" } },
  { id: 3, text: "Quando tenho um objetivo, eu:", options: { D: "Vou direto ao ponto, sem rodeios", I: "Compartilho com todos e busco apoio", S: "Planejo passo a passo e mantenho consistência", C: "Pesquiso profundamente antes de começar" } },
  { id: 4, text: "Em conflitos, costumo:", options: { D: "Confrontar diretamente e resolver logo", I: "Tentar persuadir e manter o relacionamento", S: "Evitar conflito e buscar compromisso", C: "Analisar os fatos e agir com lógica" } },
  { id: 5, text: "Meu maior ponto forte é:", options: { D: "Determinação e capacidade de liderança", I: "Entusiasmo e habilidade de comunicação", S: "Confiabilidade e paciência", C: "Precisão e pensamento analítico" } },
  { id: 6, text: "Quando cometo um erro:", options: { D: "Assumo, corrijo e sigo em frente", I: "Peço desculpas e busco validação", S: "Me sinto mal, mas evito expor o erro", C: "Analiso o que deu errado em detalhe" } },
  { id: 7, text: "Para mim, sucesso significa:", options: { D: "Conquistar resultados e superar desafios", I: "Ser reconhecida e influenciar positivamente", S: "Ter estabilidade, paz e segurança", C: "Fazer um trabalho de alta qualidade" } },
  { id: 8, text: "Minha maior dificuldade é:", options: { D: "Ser paciente e ouvir mais", I: "Focar e seguir até o fim", S: "Lidar com mudanças bruscas", C: "Tomar decisões sem todos os dados" } },
  { id: 9, text: "Ao tomar decisões, eu:", options: { D: "Decido rápido com base no instinto", I: "Considero como afeta as relações", S: "Busco segurança e evito riscos grandes", C: "Preciso de dados e análise detalhada" } },
  { id: 10, text: "Pessoas me descrevem como:", options: { D: "Direta, corajosa e determinada", I: "Animada, criativa e sociável", S: "Calma, confiável e dedicada", C: "Cuidadosa, precisa e inteligente" } },
];

const DISC_PROFILES: Record<string, { name: string; description: string; color: string }> = {
  D: { name: "Dominância", description: "Orientada a resultados, direta e decisiva. Trabalha bem sob pressão e busca desafios.", color: "bg-red-100 text-red-800" },
  I: { name: "Influência", description: "Entusiasta, comunicativa e otimista. Motiva pessoas e trabalha bem em equipe.", color: "bg-yellow-100 text-yellow-800" },
  S: { name: "Estabilidade", description: "Paciente, confiável e empática. Valoriza harmonia e é excelente ouvinte.", color: "bg-green-100 text-green-800" },
  C: { name: "Conformidade", description: "Analítica, precisa e metódica. Alta qualidade e exige exatidão.", color: "bg-blue-100 text-blue-800" },
};

export default function DiscTestStep({ onComplete, loading }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{ profile: string; scores: Record<string, number> } | null>(null);

  const setAnswer = (qId: number, val: string) => setAnswers(a => ({ ...a, [qId]: val }));

  const calculateResult = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(answers).forEach(v => { if (v in scores) scores[v as keyof typeof scores]++; });
    const profile = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    setResult({ profile, scores });
  };

  const allAnswered = Object.keys(answers).length === DISC_QUESTIONS.length;

  if (result) {
    const info = DISC_PROFILES[result.profile];
    return (
      <div className="card animate-slide-in">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">Seu Perfil DISC</h2>
        <div className={`inline-block px-4 py-2 rounded-xl font-bold text-xl mb-4 ${info.color}`}>
          Perfil {result.profile} — {info.name}
        </div>
        <p className="text-gray-600 mb-6">{info.description}</p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {Object.entries(result.scores).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className={`text-2xl font-bold ${key === result.profile ? 'text-emerald-600' : 'text-gray-400'}`}>{val}</div>
              <div className={`text-xs font-semibold mt-1 px-2 py-1 rounded-full ${key === result.profile ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {DISC_PROFILES[key].name.split('â')[0]}
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full">
                <div className={`h-full rounded-full ${key === result.profile ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  style={{ width: `${(val / DISC_QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-sm text-emerald-800">
          <strong>Como isso te ajuda:</strong> O sistema vai usar seu perfil {result.profile} para personalizar análises de produtividade, identificar padrões comportamentais e adaptar as recomendações ao seu estilo natural.
        </div>

        <button className="btn-primary w-full" onClick={() => onComplete(result.profile, result.scores)} disabled={loading}>
          {loading ? 'Salvando...' : 'Continuar →'}
        </button>
      </div>
    );
  }

  return (
    <div className="card animate-slide-in">
      <h2 className="text-2xl font-bold text-emerald-800 mb-2">Teste DISC</h2>
      <p className="text-gray-500 mb-2 text-sm">Para cada situação, escolha a opção que <strong>mais</strong> te representa. Seja honesta — não há resposta certa ou errada.</p>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs text-gray-400">{Object.keys(answers).length}/{DISC_QUESTIONS.length} respondidas</span>
        <div className="h-2 bg-gray-100 rounded-full w-40">
          <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / DISC_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {DISC_QUESTIONS.map(q => (
          <div key={q.id} className={`p-4 rounded-xl border-2 transition-colors ${answers[q.id] ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
            <p className="font-semibold text-gray-800 mb-3 text-sm">{q.id}. {q.text}</p>
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, text]) => (
                <label key={key} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  answers[q.id] === key ? 'bg-emerald-500 text-white' : 'bg-white hover:bg-emerald-50 text-gray-700'
                }`}>
                  <input type="radio" name={`q${q.id}`} value={key} checked={answers[q.id] === key}
                    onChange={() => setAnswer(q.id, key)} className="mt-0.5 accent-emerald-500" />
                  <span className="text-sm">{text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full mt-6" onClick={calculateResult} disabled={!allAnswered}>
        {allAnswered ? 'Ver meu perfil →' : `Responda todas as ${DISC_QUESTIONS.length} questões`}
      </button>
    </div>
  );
}
