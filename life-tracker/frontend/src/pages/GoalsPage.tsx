import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import type { User, Goal } from '../types';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';

interface Props { user: User; onRefresh: () => void; }

const CATEGORIES = [
  { value: 'health', label: 'Saúde', emoji: '💪', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'work', label: 'Trabalho', emoji: '💼', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'personal', label: 'Pessoal', emoji: '🌟', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'financial', label: 'Financeiro', emoji: '💰', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'relationship', label: 'Relacionamentos', emoji: '❤️', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'spiritual', label: 'Espiritual', emoji: '🙏', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const emptyForm = { category: 'health' as Goal['category'], title: '', description: '', deadline: '', priority: 1 };

export default function GoalsPage({ user }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const loadGoals = async () => {
    const data = await getGoals(user.id);
    setGoals(data);
  };

  useEffect(() => { loadGoals(); }, [user.id]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await updateGoal(user.id, editingId, form);
        setEditingId(null);
      } else {
        await createGoal(user.id, form);
      }
      setForm(emptyForm);
      setShowForm(false);
      loadGoals();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este objetivo?')) return;
    await deleteGoal(user.id, id);
    loadGoals();
  };

  const startEdit = (goal: Goal) => {
    setForm({ category: goal.category, title: goal.title, description: goal.description || '', deadline: goal.deadline || '', priority: goal.priority });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    goals: goals.filter(g => g.category === cat.value)
  })).filter(cat => cat.goals.length > 0 || showForm);

  return (
    <div className="max-w-3xl mx-auto animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">Meus Objetivos</h1>
          <p className="text-gray-500 text-sm">{goals.length} objetivo{goals.length !== 1 ? 's' : ''} ativo{goals.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(emptyForm); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo Objetivo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6 border-2 border-emerald-200 animate-slide-in">
          <h3 className="font-bold text-emerald-800 mb-4">{editingId ? 'Editar objetivo' : 'Novo objetivo'}</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Categoria</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setForm(f => ({ ...f, category: c.value as Goal['category'] }))}
                    className={`flex flex-col items-center py-2 rounded-xl border-2 transition-all ${form.category === c.value ? `${c.color} border-current` : 'border-gray-100 hover:border-emerald-200'}`}>
                    <span className="text-xl">{c.emoji}</span>
                    <span className="text-xs font-medium mt-1 text-gray-600">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Objetivo *</label>
              <input className="input-field" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Seja específica. Ex: Perder 8kg até junho de 2025" />
            </div>
            <div>
              <label className="label">Como você vai alcançar?</label>
              <textarea className="input-field resize-none" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Detalhe o plano de ação: frequência de treinos, mudanças na dieta, horas de estudo, etc." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prazo</label>
                <input className="input-field" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')} />
              </div>
              <div>
                <label className="label">Prioridade (1 = mais importante)</label>
                <input className="input-field" type="number" min="1" max="10" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="btn-primary flex items-center gap-2" disabled={loading}>
                <Check size={16} />{loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar objetivo'}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="btn-secondary flex items-center gap-2">
                <X size={16} />Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 && !showForm ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🎯</p>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhum objetivo cadastrado</h3>
          <p className="text-gray-500 text-sm mb-4">Adicione seus objetivos para que o sistema possa monitorar seu progresso e cobrar resultados.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><Plus size={16} />Adicionar objetivo</button>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(cat => {
            const catGoals = goals.filter(g => g.category === cat.value);
            if (!catGoals.length) return null;
            return (
              <div key={cat.value} className="card">
                <h3 className={`font-bold mb-4 flex items-center gap-2 px-3 py-2 rounded-xl w-fit text-sm ${cat.color} border`}>
                  <span className="text-lg">{cat.emoji}</span>{cat.label}
                </h3>
                <div className="space-y-3">
                  {catGoals.map(goal => (
                    <div key={goal.id} className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">{goal.title}</p>
                          {goal.description && <p className="text-sm text-gray-500 mt-1">{goal.description}</p>}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            {goal.deadline && <span>📅 {format(new Date(goal.deadline + 'T12:00:00'), 'dd/MM/yyyy')}</span>}
                            <span>⭐ Prioridade {goal.priority}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button onClick={() => startEdit(goal)} className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
