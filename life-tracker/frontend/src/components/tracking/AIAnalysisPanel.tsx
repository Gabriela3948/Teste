import type { AIAnalysis } from '../../types';

interface Props {
  analysis: AIAnalysis;
}

function ScoreCircle({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-1 border-4 ${color}`}>
        <span className="text-xl font-bold">{value}%</span>
      </div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
    </div>
  );
}

export default function AIAnalysisPanel({ analysis }: Props) {
  const productivityColor =
    analysis.productivity_score >= 75 ? 'border-emerald-400 text-emerald-700' :
    analysis.productivity_score >= 50 ? 'border-yellow-400 text-yellow-700' :
    'border-red-400 text-red-700';

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="card border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800 text-lg">Análise do Dia por IA</h3>
            <p className="text-xs text-gray-500">Análise honesta e baseada em dados</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-1 border-4 ${productivityColor}`}>
              <span className="text-xl font-bold">{analysis.productivity_score}</span>
            </div>
            <p className="text-xs font-bold text-gray-700">Produtividade</p>
          </div>
          <ScoreCircle value={analysis.work_percentage} label="Trabalho" color="border-blue-300 text-blue-700" />
          <ScoreCircle value={analysis.selfcare_percentage} label="Autocuidado" color="border-emerald-300 text-emerald-700" />
          <ScoreCircle value={analysis.procrastination_percentage} label="Procrastinação" color="border-red-300 text-red-700" />
        </div>
      </div>

      {/* Failures - Brutal honesty */}
      {analysis.failures?.length > 0 && (
        <div className="card border-l-4 border-red-400">
          <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <span>❌</span> Falhas do Dia (Seja honesta consigo mesma)
          </h4>
          <ul className="space-y-2">
            {analysis.failures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                <span className="mt-0.5 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Compulsion flags */}
      {analysis.compulsion_flags?.length > 0 && (
        <div className="card border-l-4 border-orange-400">
          <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
            <span>⚠️</span> Comportamentos Sabotadores
          </h4>
          <ul className="space-y-2">
            {analysis.compulsion_flags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                <span className="mt-0.5">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Time drains */}
      {analysis.time_drains?.length > 0 && (
        <div className="card border-l-4 border-yellow-400">
          <h4 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
            <span>⏳</span> Drenadores de Tempo
          </h4>
          <ul className="space-y-1">
            {analysis.time_drains.map((d, i) => (
              <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                <span>•</span><span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Highlights */}
      {analysis.highlights?.length > 0 && (
        <div className="card border-l-4 border-emerald-400">
          <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
            <span>✅</span> Pontos Positivos
          </h4>
          <ul className="space-y-2">
            {analysis.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                <span className="mt-0.5">★</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analyses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {analysis.calorie_analysis && (
          <div className="card">
            <h5 className="font-bold text-gray-700 mb-2 text-sm">🍽️ Alimentação</h5>
            <p className="text-xs text-gray-600">{analysis.calorie_analysis}</p>
          </div>
        )}
        {analysis.sleep_analysis && (
          <div className="card">
            <h5 className="font-bold text-gray-700 mb-2 text-sm">😴 Sono</h5>
            <p className="text-xs text-gray-600">{analysis.sleep_analysis}</p>
          </div>
        )}
        {analysis.mood_analysis && (
          <div className="card">
            <h5 className="font-bold text-gray-700 mb-2 text-sm">🧠 Humor</h5>
            <p className="text-xs text-gray-600">{analysis.mood_analysis}</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <div className="card bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span>💡</span> Recomendações para Amanhã
          </h4>
          <div className="space-y-2">
            {analysis.recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-emerald-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-gray-700">{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal progress */}
      {analysis.goal_progress && (
        <div className="card border-l-4 border-purple-400">
          <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
            <span>🎯</span> Progresso em Relação aos Objetivos
          </h4>
          <p className="text-sm text-gray-700">{analysis.goal_progress}</p>
        </div>
      )}

      {/* Tomorrow focus */}
      {analysis.tomorrow_focus && (
        <div className="card bg-emerald-700 text-white">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <span>🎯</span> Foco Principal de Amanhã
          </h4>
          <p className="text-emerald-100 font-medium">{analysis.tomorrow_focus}</p>
        </div>
      )}
    </div>
  );
}
