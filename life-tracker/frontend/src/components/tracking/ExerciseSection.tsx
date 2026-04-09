import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Exercise } from '../../types';
import { createExercise, deleteExercise } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  exercises: Exercise[];
  onRefresh: () => void;
}

const INTENSITIES = [
  { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-700' },
  { value: 'moderate', label: 'Moderada', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-700' },
];

const COMMON_EXERCISES = ['Caminhada', 'Corrida', 'Musculação', 'Yoga', 'Pilates', 'Natação', 'Ciclismo', 'Dança', 'Funcional', 'HIIT'];

export default function ExerciseSection({ userId, date, exercises, onRefresh }: Props) {
  const [form, setForm] = useState({ exercise_type: '', duration_minutes: 30, intensity: 'moderate', calories_burned: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const totalMinutes = exercises.reduce((s, e) => s + e.duration_minutes, 0);

  const handleAdd = async () => {
    if (!form.exercise_type.trim()) return;
    setAdding(true);
    try {
      await createExercise(userId, date, { ...form, intensity: form.intensity as Exercise['intensity'], calories_burned: form.calories_burned ? Number(form.calories_burned) : undefined });
      setForm({ exercise_type: '', duration_minutes: 30, intensity: 'moderate', calories_burned: '', notes: '' });
      setShowForm(false);
      onRefresh();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExercise(userId, date, id);
    onRefresh();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="section-title mb-0">Exercícios</h3>
          <p className="text-sm text-gray-500 mt-1">
            {exercises.length === 0 ? 'Nenhum exercício hoje' : `${exercises.length} atividade${exercises.length > 1 ? 's' : ''} · ${totalMinutes} minutos`}
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Exercício
        </button>
      </div>

      {showForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-3">
          <div>
            <label className="label text-xs">Tipo de exercício *</label>
            <input className="input-field text-sm" type="text" placeholder="Ex: Corrida, Musculação, Yoga..." value={form.exercise_type}
              onChange={e => setForm(f => ({ ...f, exercise_type: e.target.value }))} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_EXERCISES.map(ex => (
                <button key={ex} onClick={() => setForm(f => ({ ...f, exercise_type: ex }))}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${form.exercise_type === ex ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Duração (min) *</label>
              <input className="input-field text-sm" type="number" min="1" value={form.duration_minutes}
                onChange={e => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label text-xs">Intensidade</label>
              <select className="input-field text-sm" value={form.intensity} onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))}>
                {INTENSITIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Calorias (opcional)</label>
              <input className="input-field text-sm" type="number" placeholder="Ex: 300" value={form.calories_burned}
                onChange={e => setForm(f => ({ ...f, calories_burned: e.target.value }))} />
            </div>
          </div>
          <input className="input-field text-sm" placeholder="Notas (como se sentiu, etc.)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm" disabled={adding}>
              {adding ? 'Adicionando...' : '+ Registrar exercício'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {exercises.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🏃</p>
          <p className="text-sm">Nenhum exercício hoje. Não esqueça de se mover!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {exercises.map(ex => {
            const intensity = INTENSITIES.find(i => i.value === ex.intensity);
            return (
              <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800">{ex.exercise_type}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${intensity?.color}`}>{intensity?.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>⏱️ {ex.duration_minutes} min</span>
                    {ex.calories_burned && <span>🔥 {ex.calories_burned} kcal</span>}
                    {ex.notes && <span className="italic">{ex.notes}</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(ex.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
