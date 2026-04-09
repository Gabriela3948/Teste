import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Flame } from 'lucide-react';
import type { Meal } from '../../types';
import { createMeal, deleteMeal } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  meals: Meal[];
  calorieGoal: number;
  onRefresh: () => void;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Café da Manhã', emoji: '🌅' },
  { value: 'morning_snack', label: 'Lanche da Manhã', emoji: '🍎' },
  { value: 'lunch', label: 'Almoço', emoji: '🍽️' },
  { value: 'afternoon_snack', label: 'Lanche da Tarde', emoji: '☕' },
  { value: 'dinner', label: 'Jantar', emoji: '🌙' },
  { value: 'late_snack', label: 'Ceia/Extra', emoji: '🌛' },
];

export default function MealsSection({ userId, date, meals, calorieGoal, onRefresh }: Props) {
  const [form, setForm] = useState({ meal_type: 'breakfast', description: '', quality_score: 3, compulsion_flag: false, notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const totalCalories = meals.reduce((s, m) => s + (m.estimated_calories || 0), 0);
  const compulsions = meals.filter(m => m.compulsion_flag).length;
  const caloriePercent = Math.min((totalCalories / calorieGoal) * 100, 150);

  const handleAdd = async () => {
    if (!form.description.trim()) return;
    setAdding(true);
    try {
      await createMeal(userId, date, { ...form, meal_type: form.meal_type as Meal['meal_type'], compulsion_flag: form.compulsion_flag ? 1 : 0 });
      setForm({ meal_type: 'breakfast', description: '', quality_score: 3, compulsion_flag: false, notes: '' });
      setShowForm(false);
      onRefresh();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMeal(userId, date, id);
    onRefresh();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="section-title mb-0">Alimentação</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-emerald-700">{totalCalories}</span> / {calorieGoal} kcal
            {compulsions > 0 && <span className="ml-2 text-red-500 font-medium">⚠️ {compulsions} compulsão{compulsions > 1 ? 'ões' : ''}</span>}
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Refeição
        </button>
      </div>

      {/* Calorie bar */}
      <div className="mb-4">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${caloriePercent > 110 ? 'bg-red-400' : caloriePercent > 90 ? 'bg-emerald-500' : 'bg-emerald-300'}`}
            style={{ width: `${Math.min(caloriePercent, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span className={caloriePercent > 110 ? 'text-red-500 font-medium' : 'text-emerald-600 font-medium'}>
            {caloriePercent.toFixed(0)}% da meta
          </span>
          <span>{calorieGoal}</span>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Refeição</label>
              <select className="input-field text-sm" value={form.meal_type} onChange={e => setForm(f => ({ ...f, meal_type: e.target.value }))}>
                {MEAL_TYPES.map(m => <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Qualidade (1-5)</label>
              <input className="input-field text-sm" type="number" min="1" max="5" value={form.quality_score}
                onChange={e => setForm(f => ({ ...f, quality_score: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="label text-xs">O que você comeu? *</label>
            <textarea className="input-field text-sm resize-none" rows={2} placeholder="Descreva tudo que comeu. Ex: 2 ovos mexidos, 2 fatias de pão integral, 1 banana, café com leite..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <p className="text-xs text-emerald-600 mt-1">💡 A IA vai estimar as calorias automaticamente!</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.compulsion_flag} onChange={e => setForm(f => ({ ...f, compulsion_flag: e.target.checked }))}
              className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-red-600 font-medium">⚠️ Foi uma compulsão alimentar</span>
          </label>
          {form.compulsion_flag && (
            <input className="input-field text-sm" placeholder="O que causou essa compulsão?" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm" disabled={adding}>
              {adding ? 'Adicionando...' : '+ Registrar refeição'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {meals.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm">Nenhuma refeição registrada. Registre tudo que comer!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {MEAL_TYPES.map(type => {
            const typeMeals = meals.filter(m => m.meal_type === type.value);
            if (!typeMeals.length) return null;
            return (
              <div key={type.value}>
                <p className="text-xs font-semibold text-emerald-700 mb-1">{type.emoji} {type.label}</p>
                {typeMeals.map(meal => (
                  <div key={meal.id} className={`flex items-start gap-3 p-3 rounded-xl border mb-1.5 ${meal.compulsion_flag ? 'border-red-200 bg-red-50' : 'border-emerald-100 bg-white'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{meal.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {meal.estimated_calories && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <Flame size={11} />{meal.estimated_calories} kcal
                          </span>
                        )}
                        {meal.quality_score && (
                          <span className="text-xs text-gray-400">Qualidade: {'⭐'.repeat(meal.quality_score)}</span>
                        )}
                        {meal.compulsion_flag && (
                          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <AlertTriangle size={11} />Compulsão
                          </span>
                        )}
                        {meal.notes && <span className="text-xs text-gray-400 italic">{meal.notes}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(meal.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
