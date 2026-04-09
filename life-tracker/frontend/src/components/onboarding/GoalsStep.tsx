import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface GoalForm {
  category: string;
  title: string;
  description: string;
  deadline: string;
}

interface Props {
  onComplete: (goals: GoalForm[]) => void;
  loading: boolean;
}

const CATEGORIES = [
  { value: 'health', label: 'Saúde', emoji: '💪' },
  { value: 'work', label: 'Trabalho', emoji: '💼' },
  { value: 'personal', label: 'Pessoal', emoji: '🌟' },
  { value: 'financial', label: 'Financeiro', emoji: '💰' },
  { value: 'relationship', label: 'Relacionamentos', emoji: '❤️' },
  { value: 'spiritual', label: 'Espiritual', emoji: '🙏' },
];

const EXAMPLES = [
  { category: 'health', title: 'Perder 5kg', description: 'Chegar a 60kg com alimentação equilibrada e exercícios' },
  { category: 'work', title: 'Aumentar faturamento 30%', description: 'Expandir a carteira de clientes e serviços' },
  { category: 'personal', title: 'Ler 12 livros no ano', description: 'Ler 1 livro por mês para desenvolvimento pessoal' },
];

export default function GoalsStep({ onComplete, loading }: Props) {
  const [goals, setGoals] = useState<GoalForm[]>([
    { category: 'health', title: '', description: '', deadline: '' }
  ]);

  const addGoal = () => setGoals(g => [...g, { category: 'personal', title: '', description: '', deadline: '' }]);
  const removeGoal = (i: number) => setGoals(g => g.filter((_, idx) => idx !== i));
  const updateGoal = (i: number, field: keyof GoalForm, value: string) =>
    setGoals(g => g.map((goal, idx) => idx === i ? { ...goal, [field]: value } : goal));

  const validGoals = goals.filter(g => g.title.trim());
  const handleSubmit = () => {
    if (validGoals.length === 0) return;
    onComplete(validGoals);
  };

  return (
    <div className="card animate-slide-in">
      <h2 className="text-2xl font-bold text-emerald-800 mb-2">Seus Objetivos</h2>
      <p className="text-gray-500 mb-2 text-sm">O sistema vai usar esses objetivos para te cobrar, medir progresso e direcionar recomendações diárias. Seja específica e realista.</p>

      <div className="bg-emerald-50 rounded-xl p-3 mb-5">
        <p className="text-xs font-semibold text-emerald-700 mb-2">Exemplos de objetivos:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => {
              const idx = goals.findIndex(g => !g.title);
              if (idx >= 0) { updateGoal(idx, 'title', ex.title); updateGoal(idx, 'category', ex.category); updateGoal(idx, 'description', ex.description); }
              else setGoals(g => [...g, { ...ex, deadline: '' }]);
            }} className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              + {ex.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-600">Objetivo {i + 1}</span>
              {goals.length > 1 && (
                <button onClick={() => removeGoal(i)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label">Categoria</label>
                <select className="input-field text-sm" value={goal.category} onChange={e => updateGoal(i, 'category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Prazo (opcional)</label>
                <input className="input-field text-sm" type="date" value={goal.deadline} onChange={e => updateGoal(i, 'deadline', e.target.value)} />
              </div>
            </div>
            <div className="mb-3">
              <label className="label">Objetivo *</label>
              <input className="input-field text-sm" type="text" value={goal.title} onChange={e => updateGoal(i, 'title', e.target.value)} placeholder="Ex: Perder 5kg, aumentar faturamento, criar rotina matinal..." />
            </div>
            <div>
              <label className="label">Descrição / Detalhes</label>
              <textarea className="input-field text-sm resize-none" rows={2} value={goal.description} onChange={e => updateGoal(i, 'description', e.target.value)} placeholder="Como você vai alcançar esse objetivo?" />
            </div>
          </div>
        ))}
      </div>

      <button onClick={addGoal} className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
        <Plus size={16} /> Adicionar objetivo
      </button>

      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <p className="text-xs text-amber-700"><strong>Lembre-se:</strong> o sistema vai te cobrar diariamente sobre esses objetivos. Você pode editar ou adicionar mais no menu "Objetivos" depois.</p>
      </div>

      <button className="btn-primary w-full mt-4" onClick={handleSubmit} disabled={loading || validGoals.length === 0}>
        {loading ? 'Salvando...' : `Começar com ${validGoals.length} objetivo${validGoals.length !== 1 ? 's' : ''} →`}
      </button>
    </div>
  );
}
